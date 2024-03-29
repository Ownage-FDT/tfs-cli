import chalk from 'chalk'
import { BaseCommand } from '../base-command'
import { ApiResponse, File, ListFilesResponse } from '../types'
import { ux } from '@oclif/core'

export default class List extends BaseCommand<typeof List> {
    static description = 'List all files associated with your account.'

    static examples = ['<%= config.bin %> <%= command.id %>']

    static flags = {
        ...ux.table.flags()
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(List)
        const { data } = await this.client.get<ApiResponse<ListFilesResponse>>('/list')

        ux.table<File>(
            data.data.items,
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
                expiresAt: {
                    header: 'Expires At'
                },
                createdAt: {
                    header: 'Created At',
                    extended: true
                },
                lastDownloadedAt: {
                    header: 'Last Downloaded At',
                    get: (row) => row.lastDownloadedAt ?? '',
                    extended: true
                }
            },
            {
                printLine: this.log.bind(this),
                ...flags
            }
        )

        if (data.data.meta.hasMore) {
            this.log('\n')
            this.log(chalk.yellow('The TFS CLI is limited to 20 files. Please visit the TFS dashboard to see more: '))
            ux.url(chalk.blue('https://trytfs.com/dashboard/files'), 'https://trytfs.com/dashboard/files')
        }
    }
}
