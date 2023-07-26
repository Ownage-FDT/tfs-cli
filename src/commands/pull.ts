import { Args, Flags } from '@oclif/core'
import { BaseCommand } from '../base-command'
import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as path from 'node:path'
import inquirer from 'inquirer'

export default class Pull extends BaseCommand<typeof Pull> {
    static description = 'Download a file by its ID'

    static examples = [
        '<%= config.bin %> <%= command.id %> <file-id>',
        '<%= config.bin %> <%= command.id %> <file-id> --output /home/user/downloads',
        '<%= config.bin %> <%= command.id %> <file-id> --output /home/user/downloads --name my-file',
        '<%= config.bin %> <%= command.id %> <file-id> --output /home/user/downloads --name my-file --force'
    ]

    static flags = {
        force: Flags.boolean({ char: 'f', description: 'Force overwrite of existing file' }),
        output: Flags.string({ char: 'o', description: 'Absolute path to the output directory' }),
        name: Flags.string({ char: 'n', description: 'Override the filename of the downloaded file' })
    }

    static args = {
        fileId: Args.string({
            name: 'fileId',
            required: true,
            description: 'ID of the file to download'
        })
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Pull)

        // get the file from the server
        const response = await this.client.get(`/pull/${args.fileId}`, { responseType: 'arraybuffer' })

        // get the file name from the response headers
        const contentDisposition = response.headers['content-disposition']
        const originalFileName = contentDisposition.split('filename=')[1].replaceAll('"', '')
        const extension = path.extname(originalFileName)

        // get the filename from the flag or use the original filename without extension
        const fileName = flags.name ? `${flags.name}${extension}` : originalFileName

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

                const newFileName = renameAnswer.fileName.trim() + extension

                if (newFileName === '') {
                    this.log(chalk.yellow('File download operation canceled.'))
                    return
                }

                // update the filePath with the new file name
                filePath = path.resolve(outputPath, newFileName)
            }
        }

        // write the file to the path
        await fs.writeFile(filePath, response.data)

        this.log(chalk.green(`File downloaded successfully to ${filePath}`))
    }
}
