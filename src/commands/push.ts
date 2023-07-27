import { Args, Flags, ux } from '@oclif/core'
import { BaseCommand } from '../base-command'
import * as fs from 'fs-extra'
import { ApiResponse, File } from '../types'
import chalk from 'chalk'
import { AxiosProgressEvent } from 'axios'

export default class Push extends BaseCommand<typeof Push> {
    static description = 'Upload a file'

    static examples = [
        '<%= config.bin %> <%= command.id %> /path/to/file',
        '<%= config.bin %> <%= command.id %> /path/to/file --ttl 3600'
    ]

    static args = {
        filePath: Args.string({
            name: 'filePath',
            required: true,
            description: 'Absolute path to the file to upload'
        })
    }

    static flags = {
        ttl: Flags.string({ char: 't', description: 'Time to live for the file in seconds' })
    }

    public async run(): Promise<void> {
        const { args } = await this.parse(Push)

        const fileData = await fs.readFile(args.filePath)
        const fileStats = await fs.stat(args.filePath)

        const formData = new FormData()
        formData.append('file', new Blob([fileData.buffer]), args.filePath)

        if (this.flags.ttl) {
            formData.append('ttl', this.flags.ttl)
        }

        try {
            const progressBar = ux.progress({
                format: `Uploading file [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes`,
                clearOnComplete: true,
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                hideCursor: true
            })

            progressBar.start(fileStats.size, 0)

            const {
                data: { data }
            } = await this.client.post<ApiResponse<File>>('/push', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    progressBar.update(progressEvent.loaded, { total: progressEvent.total })
                }
            })

            progressBar.stop()

            if (this.flags.ttl) {
                this.log(
                    chalk.green(`File uploaded successfully with ID ${data._id} and will expire at ${data.expiresAt}`)
                )
            } else {
                this.log(chalk.green(`File uploaded successfully with ID ${data._id}`))
            }
        } catch (error: any) {
            this.error(
                `An error occurred while uploading the file. Please try again later: ${
                    error?.response?.data?.message ?? error?.message
                }`
            )
        }
    }
}
