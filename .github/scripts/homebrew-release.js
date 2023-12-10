const fs = require('fs')
const execa = require('execa')
const path = require('path')
const rm = require('rimraf')
const mkdirp = require('mkdirp')
const { promisify } = require('util')
const { pipeline } = require('stream')
const crypto = require('crypto')

const { GITHUB_SHORT_SHA } = process.env
const pjson = require(path.join(__dirname, '..', '..', 'package.json'))
const bucketName = pjson.oclif.update.s3.bucket
const bucketHost = pjson.oclif.update.s3.host
const cliName = pjson.oclif.bin

async function calculateSHA256(fileName) {
    const hash = crypto.createHash('sha256')
    hash.setEncoding('hex')
    await promisify(pipeline)(fs.createReadStream(fileName), hash)
    return hash.read()
}

const TEMPLATES = path.join(__dirname, 'templates')
const fileSuffix = '.tar.gz'
const ARCH_INTEL = 'x64'
const ARCH_ARM = 'arm64'

function downloadFileFromS3(s3Path, fileName, downloadPath) {
    const downloadTo = path.join(downloadPath, fileName)
    const commandStr = `aws s3 cp s3://${bucketName}/${s3Path}/${fileName} ${downloadTo} --region us-west-2 --endpoint-url ${bucketHost}`
    console.log(commandStr)
    return execa.command(commandStr)
}

async function updateTfsFormula(brewDir) {
    const templatePath = path.join(TEMPLATES, 'homebrew-tfs.rb')
    const template = fs.readFileSync(templatePath).toString('utf-8')
    const formulaPath = path.join(brewDir, 'Formula', 'tfs.rb')

    const fileNamePrefix = `${cliName}-v${pjson.version}-${GITHUB_SHORT_SHA}`
    const s3KeyPrefix = `versions/${pjson.version}/${GITHUB_SHORT_SHA}`
    const urlPrefix = `https://tfs-cli-assets.nyc3.digitaloceanspaces.com/${s3KeyPrefix}`

    const fileNameMacIntel = `${fileNamePrefix}-darwin-${ARCH_INTEL}${fileSuffix}`
    const fileNameMacArm = `${fileNamePrefix}-darwin-${ARCH_ARM}${fileSuffix}`
    const fileNameLinuxIntel = `${fileNamePrefix}-linux-${ARCH_INTEL}${fileSuffix}`
    const fileNameLinuxArm = `${fileNamePrefix}-linux-arm${fileSuffix}`

    // download files from S3 for SHA calc
    await Promise.all([
        downloadFileFromS3(s3KeyPrefix, fileNameMacIntel, __dirname),
        downloadFileFromS3(s3KeyPrefix, fileNameMacArm, __dirname),
        downloadFileFromS3(s3KeyPrefix, fileNameLinuxIntel, __dirname),
        downloadFileFromS3(s3KeyPrefix, fileNameLinuxArm, __dirname)
    ])

    const sha256MacIntel = await calculateSHA256(path.join(__dirname, fileNameMacIntel))
    const sha256MacArm = await calculateSHA256(path.join(__dirname, fileNameMacArm))
    const sha256LinuxIntel = await calculateSHA256(path.join(__dirname, fileNameLinuxIntel))
    const sha256LinuxArm = await calculateSHA256(path.join(__dirname, fileNameLinuxArm))

    const templateReplaced = template
        .replace('__CLI_VERSION__', pjson.version)

        .replace('__CLI_MAC_INTEL_DOWNLOAD_URL__', `${urlPrefix}/${fileNameMacIntel}`)
        .replace('__CLI_MAC_INTEL_SHA256__', sha256MacIntel)

        .replace('__CLI_MAC_ARM_DOWNLOAD_URL__', `${urlPrefix}/${fileNameMacArm}`)
        .replace('__CLI_MAC_ARM_SHA256__', sha256MacArm)

        .replace('__CLI_LINUX_DOWNLOAD_URL__', `${urlPrefix}/${fileNameLinuxIntel}`)
        .replace('__CLI_LINUX_SHA256__', sha256LinuxIntel)

        .replace('__CLI_LINUX_ARM_DOWNLOAD_URL__', `${urlPrefix}/${fileNameLinuxArm}`)
        .replace('__CLI_LINUX_ARM_SHA256__', sha256LinuxArm)

    fs.writeFileSync(formulaPath, templateReplaced)

    console.log(`done updating tfs Formula in ${formulaPath}`)
}

async function setupGit() {
    const githubSetupPath = path.join(__dirname, 'utils', '_setup-github')
    await execa(githubSetupPath)
}

async function updateHomebrew() {
    const tmp = path.join(__dirname, 'tmp')
    const homebrewDir = path.join(tmp, 'homebrew-tfs-cli')
    mkdirp.sync(tmp)
    rm.sync(homebrewDir)

    await setupGit()

    console.log(`cloning https://github.com/Ownage-FDT/homebrew-tfs-cli to ${homebrewDir}`)
    await execa('git', ['clone', 'git@github.com:Ownage-FDT/homebrew-tfs-cli.git', homebrewDir])
    console.log(`done cloning Ownage-FDT/homebrew-tfs-cli to ${homebrewDir}`)

    await updateTfsFormula(homebrewDir)

    const git = async (args, opts = {}) => {
        await execa('git', ['-C', homebrewDir, ...args], opts)
    }

    console.log('updating local git...')
    await git(['add', 'Formula'])
    await git(['config', '--local', 'core.pager', 'cat'])
    await git(['diff', '--cached'], { stdio: 'inherit' })
    await git(['commit', '-m', `release tfs v${pjson.version}`])
    if (process.env.SKIP_GIT_PUSH === undefined) {
        await git(['push', 'origin', 'main'])
    }
}

updateHomebrew().catch((error) => {
    console.error('error running .github/scripts/homebrew-release.js', error)
    process.exit(1)
})
