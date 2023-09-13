import { BaseCommand } from '../../base-command'
import path from 'node:path'
import fs from 'fs-extra'

export default class ConfigList extends BaseCommand<typeof ConfigList> {
    static description = 'List the configuration values'

    static examples = ['<%= config.bin %> <%= command.id %>']

    public async run(): Promise<void> {
        const configFilePath = path.join(this.config.home, `.tfsrc`)

        const currentConfig = fs.readJSONSync(configFilePath)

        this.log(JSON.stringify(currentConfig, null, 4))
    }
}
