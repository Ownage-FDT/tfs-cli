import chalk from 'chalk'
import { BaseCommand } from '../../base-command'
import { Account, ApiResponse } from '../../types'

export default class Whoami extends BaseCommand<typeof Whoami> {
    static description = 'Shows the currently authenticated user information'

    static examples = ['<%= config.bin %> <%= command.id %>']

    public async run(): Promise<void> {
        const { data } = await this.client.get<ApiResponse<Account>>('/whoami')

        this.log(chalk.green(`You are currently authenticated as ${data.data.name}`))
    }
}
