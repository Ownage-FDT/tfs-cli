import { Args, ux } from '@oclif/core'
import { BaseCommand } from '../../base-command'
import chalk from 'chalk'
import { Account, ApiResponse } from '../../types'

export default class AddToken extends BaseCommand<typeof AddToken> {
    static description = 'Authenticate and store access token'

    static examples = ['<%= config.bin %> <%= command.id %> <access-token>']

    static args = {
        accessToken: Args.string({
            name: 'accessToken',
            required: true,
            description: 'Access token to use for authentication'
        })
    }

    public async run(): Promise<void> {
        const { args } = await this.parse(AddToken)
        ux.action.start(chalk.blue('Authenticating'))

        const { data } = await this.client.get<ApiResponse<Account>>('/whoami', {
            headers: {
                Authorization: `Bearer ${args.accessToken}`
            }
        })

        this.setConfigValue('accessToken', args.accessToken)
        ux.action.stop()
        this.log(chalk.green(`Authenticated successfully as ${data.data.name}`))
    }
}
