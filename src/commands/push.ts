import { Args, ux } from '@oclif/core'
import { BaseCommand } from '../base-command'
import * as fs from 'fs-extra'
import { ApiResponse, File } from '../types'
import chalk from 'chalk'
import { AxiosProgressEvent } from 'axios'
import { progress } from '@oclif/core/lib/cli-ux'

export default class Push extends BaseCommand<typeof Push> {
    static description = 'Upload a file'

    static examples = []

    static args = {
        filePath: Args.string({
            name: 'filePath',
            required: true,
            description: 'Absolute Path to the file to upload'
        })
    }

    public async run(): Promise<void> {
        const { args } = await this.parse(Push)

        const fileData = await fs.readFile(args.filePath)
        const fileStats = await fs.stat(args.filePath)

        const formData = new FormData()
        formData.append('file', new Blob([fileData.buffer]), args.filePath)

        const progressBar = ux.progress({
            format: `Uploading file [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes`,
            clearOnComplete: true,
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        })

        progressBar.start(fileStats.size, 0)

        const { data } = await this.client.post<ApiResponse<File>>('/push', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                progressBar.update(progressEvent.loaded, { total: progressEvent.total })
            }
        })

        progressBar.stop()

        this.log(chalk.green(`File uploaded successfully with ID ${data.data._id}`))
    }
}
