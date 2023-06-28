import { BaseCommand } from '../base-command'
import { ApiResponse, File } from '../types'
import { ux } from '@oclif/core'

export default class List extends BaseCommand<typeof List> {
    static description = 'List all the files'

    static examples = ['<%= config.bin %> <%= command.id %>']

    static flags = {
        ...ux.table.flags()
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(List)
        const { data } = await this.client.get<ApiResponse<File[]>>('/list')

        ux.table<File>(
            data.data,
            {
                _id: {
                    header: 'ID'
                },
                name: {
                    header: 'Name'
                },
                size: {
                    header: 'Size',
                    get: (row) => `${row.size / 1000} Kb`
                },
                totalDownloads: {
                    header: 'Total Downloads',
                    get: (row) => row.totalDownloads ?? 0
                },
                createdAt: {
                    header: 'Created At',
                    extended: true
                },
                expiresAt: {
                    header: 'Expires At',
                    extended: true
                },
                lastDownloadedAt: {
                    header: 'Last Downloaded At',
                    get: (row) => row.lastDownloadedAt ?? null
                }
            },
            {
                printLine: this.log.bind(this),
                ...flags
            }
        )
    }
}
