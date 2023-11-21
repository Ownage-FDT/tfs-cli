import { Args, Flags, ux } from '@oclif/core'
import { BaseCommand } from '../base-command'
import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as path from 'node:path'
import inquirer from 'inquirer'
import { decryptFile } from '../utils'
import { AxiosProgressEvent } from 'axios'

export default class Pull extends BaseCommand<typeof Pull> {
    static description = 'Pull or download a file from the server.'

    static examples = [
        '<%= config.bin %> <%= command.id %> <file-id>',
        '<%= config.bin %> <%= command.id %> <file-id> --output /home/user/downloads',
        '<%= config.bin %> <%= command.id %> <file-id> --output /home/user/downloads --name my-file',
        '<%= config.bin %> <%= command.id %> <file-id> --output /home/user/downloads --key my-secret-key',
        '<%= config.bin %> <%= command.id %> <file-id> --output /home/user/downloads --name my-file --force'
    ]

    static flags = {
        name: Flags.string({ char: 'n', description: 'The name of the file to save as.' }),
        force: Flags.boolean({ char: 'f', description: 'Force overwrite of existing file.' }),
        output: Flags.string({ char: 'o', description: 'The absolute path to save the file to.' }),
        key: Flags.string({ char: 'k', description: 'The key to use for decrypting the file.' })
    }

    static args = {
        fileId: Args.string({
            name: 'fileId',
            required: true,
            description: 'The ID of the file to download.'
        })
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Pull)

        // validate the encryption key
        const defaultEncryptionKey = this.getConfigValue('encryptionKey')

        if (!this.flags.key && !defaultEncryptionKey) {
            this.error('Encryption key is required for decrypting the file.')
        }

        const encryptionKey = (this.flags.key ?? defaultEncryptionKey) as string

        if (encryptionKey.length < 16) {
            this.error('Encryption key must be at least 16 characters long.')
        }

        const progressBar = ux.progress({
            format: `Downloading file [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes`,
            clearOnComplete: true,
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        })

        // get the file from the server
        const response = await this.client.get(`/pull/${args.fileId}`, {
            responseType: 'arraybuffer',
            onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
                progressBar.start(progressEvent.total ?? 0, 0)
                progressBar.update(progressEvent.loaded)
            }
        })

        progressBar.stop()

        // get the file name from the response headers
        const contentDisposition = response.headers['content-disposition']

        const originalFileName = contentDisposition.split('filename=')[1].replaceAll('"', '')
        const fileExtension = path.extname(originalFileName)

        // get the filename from the flag or use the original filename
        const fileName = flags.name ? `${flags.name}${fileExtension}` : originalFileName

        // get the path to write the file to
        const outputPath = flags.output ?? process.cwd()

        // get the absolute path to the file
        let filePath = path.resolve(outputPath, fileName)

        if (fs.existsSync(filePath) && !flags.force) {
            // prompt the user that the file already exists, and ask if they want to overwrite it
            const overwriteAnswer = await inquirer.prompt({
                type: 'confirm',
                name: 'overwrite',
                message: `${fileName} already exists. Do you want to overwrite it?`
            })

            if (!overwriteAnswer.overwrite) {
                // if the user chooses not to overwrite, ask for a new file name or cancel the operation
                const renameAnswer = await inquirer.prompt({
                    type: 'input',
                    name: 'fileName',
                    message: `Please enter a new file name or leave it empty to cancel:`
                })

                const newFileName = renameAnswer.fileName.trim()

                if (newFileName === '') {
                    this.log(chalk.yellow('File download operation canceled.'))
                    return
                }

                // update the filePath with the new file name
                filePath = path.resolve(outputPath, newFileName + fileExtension)
            }
        }

        const decryptedFileData = decryptFile(response.data, encryptionKey)

        // write the file to the path
        await fs.writeFile(filePath, decryptedFileData)

        this.log(chalk.green(`\nFile downloaded successfully to ${filePath}.`))
    }
}
