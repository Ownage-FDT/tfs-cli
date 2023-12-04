import { BaseCommand } from '../../base-command'
import path from 'node:path'
import fs from 'fs-extra'
import { ux } from '@oclif/core'

export default class ConfigList extends BaseCommand<typeof ConfigList> {
    static description = 'List the configuration values'

    static examples = ['<%= config.bin %> <%= command.id %>']

    public async run(): Promise<void> {
        const configFilePath = path.join(this.config.home, `.tfsrc`)

        const currentConfig = fs.readJSONSync(configFilePath)

        const configEntries = Object.entries(currentConfig).map(([key, value]) => ({
            key,
            value
        }))

        ux.table(
            configEntries,
            {
                key: {
                    header: 'Key'
                },
                value: {
                    header: 'Value'
                }
            },
            {
                printLine: this.log.bind(this)
            }
        )
    }
}
