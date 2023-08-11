import { Args, Flags, ux } from '@oclif/core'
import { BaseCommand } from '../base-command'
import * as fs from 'fs-extra'
import { ApiResponse, File } from '../types'
import chalk from 'chalk'
import { AxiosError, AxiosProgressEvent } from 'axios'
import { encryptFile } from '../utils'

export default class Push extends BaseCommand<typeof Push> {
    static description = 'Push or upload a file to the server.'

    static examples = [
        '<%= config.bin %> <%= command.id %> /path/to/file',
        '<%= config.bin %> <%= command.id %> /path/to/file --ttl 3600',
        '<%= config.bin %> <%= command.id %> /path/to/file --ttl 3600 --key my-secret-key'
    ]

    static args = {
        filePath: Args.string({
            name: 'filePath',
            required: true,
            description: 'The absolute path to the file to upload.'
        })
    }

    static flags = {
        ttl: Flags.string({ char: 't', description: 'The time to live for the file in seconds.' }),
        key: Flags.string({ char: 'k', description: 'The key to use for encrypting the file.' })
    }

    public async run(): Promise<void> {
        const { args } = await this.parse(Push)
        const defaultEncryptionKey = this.getConfigValue('encryptionKey')

        if (!this.flags.key && !defaultEncryptionKey) {
            this.error('Encryption key is required for encrypting the file.')
        }

        const encryptionKey = (this.flags.key ?? defaultEncryptionKey) as string

        if (encryptionKey.length < 16) {
            this.error('Encryption key must be at least 16 characters long.')
        }

        const formData = new FormData()
        const fileData = await fs.readFile(args.filePath)
        const fileStats = await fs.stat(args.filePath)

        if (this.flags.ttl) {
            formData.append('ttl', this.flags.ttl)
        }

        const encryptedFileData = encryptFile(fileData, encryptionKey)

        formData.append('file', new Blob([new Uint8Array(encryptedFileData)]), args.filePath)

        try {
            const progressBar = ux.progress({
                format: `Uploading file [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes`,
                clearOnComplete: true,
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                hideCursor: true
            })

            progressBar.start(fileStats.size, 0)

            const { data: result } = await this.client.post<ApiResponse<File>>('/push', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    progressBar.update(progressEvent.loaded, { total: progressEvent.total })
                }
            })

            progressBar.stop()

            this.log(chalk.green('File uploaded successfully'))
            this.log(`File ID: ${chalk.blue(result.data._id)}`)

            if (result.data.expiresAt) {
                this.log(`File Expiration: ${chalk.blue(result.data.expiresAt)}`)
            }

            this.log(`File Encryption Key: ${chalk.blue(encryptionKey)}`)
        } catch (error: any) {
            if (error instanceof AxiosError) {
                this.error(`Cannot upload the file: ${error.response?.data?.message ?? error.message}`)
                return
            }

            this.error(`Cannot upload the file: ${error.message}`)
        }
    }
}
