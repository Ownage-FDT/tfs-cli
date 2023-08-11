import { Args } from '@oclif/core'
import { BaseCommand } from '../base-command'
import chalk from 'chalk'

export default class Remove extends BaseCommand<typeof Remove> {
    static description = 'Remove or delete a file from the server.'

    static examples = ['<%= config.bin %> <%= command.id %> <fileId>']

    static args = {
        fileId: Args.string({
            name: 'fileId',
            required: true,
            description: 'The ID of the file to remove.'
        })
    }

    public async run(): Promise<void> {
        const { args } = await this.parse(Remove)

        await this.client.delete(`/remove/${args.fileId}`)

        this.log(chalk.green(`File ${args.fileId} removed successfully`))
    }
}
