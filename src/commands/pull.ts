import { Args, Flags } from '@oclif/core'
import { BaseCommand } from '../base-command'
import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as path from 'node:path'

export default class Pull extends BaseCommand<typeof Pull> {
    static description = 'Download a file by its ID'

    static examples = [
        '<%= config.bin %> <%= command.id %> <file-id>',
        '<%= config.bin %> <%= command.id %> <file-id> --output /home/user/downloads'
    ]

    static flags = {
        output: Flags.string({ char: 'o', description: 'Absolute path to the output directory' })
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
        const fileName = contentDisposition.split('filename=')[1].replaceAll('"', '')

        // get the path to write the file to
        const outputPath = flags.output ?? process.cwd()

        // check if the file already exists
        const filePath = path.resolve(outputPath, fileName)

        // write the file to the path
        await fs.writeFile(filePath, response.data)

        this.log(chalk.green(`File downloaded successfully to ${filePath}`))
    }
}
