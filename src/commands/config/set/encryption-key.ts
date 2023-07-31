import { Args } from '@oclif/core'
import { BaseCommand } from '../../../base-command'
import chalk from 'chalk'

export default class ConfigSetEncryptionKey extends BaseCommand<typeof ConfigSetEncryptionKey> {
    static description = 'Set the encryption key to use for encrypting and decrypting files.'

    static examples = ['<%= config.bin %> <%= command.id %> <encryption-key>']

    static args = {
        key: Args.string({
            name: 'key',
            required: true,
            description: 'Encryption key to use for encrypting and decrypting files.'
        })
    }

    public async run(): Promise<void> {
        const { args } = await this.parse(ConfigSetEncryptionKey)

        if (args.key.length < 16) {
            this.error('Encryption key must be at least 16 characters long.')
        }

        this.setConfigValue('encryptionKey', args.key)

        this.log(chalk.green(`Encryption key set successfully to ${args.key}`))
    }
}
