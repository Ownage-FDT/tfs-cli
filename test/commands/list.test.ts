import { expect, test } from '@oclif/test'
import { File } from '../../src/types'

describe('list', function () {
    const baseUrl = process.env.TFS_HOST_URL ?? 'http://localhost:3000'

    const sampleResponse: File[] = [
        {
            _id: '610be8e6959dbad9c7e9e5e1',
            name: 'file1.txt',
            size: 1024,
            createdAt: '2023-06-21T10:00:00Z',
            expiresAt: '2023-06-22T10:00:00Z',
            totalDownloads: 50,
            lastDownloadedAt: '2023-06-23T10:00:00Z'
        },
        {
            _id: '610be8e6959dbad9c7e9e5e2',
            name: 'file2.txt',
            size: 2048,
            createdAt: '2023-06-24T10:00:00Z',
            expiresAt: '2023-06-25T10:00:00Z',
            totalDownloads: 100,
            lastDownloadedAt: '2023-06-26T10:00:00Z'
        }
    ]

    test.stdout()
        .nock(baseUrl, (client) =>
            client.get('/list').reply(200, {
                data: sampleResponse
            })
        )
        .command(['list'])
        .it('can get the list of files', (ctx) => {
            // check for file1
            expect(ctx.stdout).to.contain('610be8e6959dbad9c7e9e5e1')
            expect(ctx.stdout).to.contain('file1.txt')
            expect(ctx.stdout).to.contain('1.024 Kb')
            expect(ctx.stdout).to.contain('2023-06-23T10:00:00Z')
            expect(ctx.stdout).to.contain(50)
            expect(ctx.stdout).to.not.contain('2023-06-21T10:00:00Z')
            expect(ctx.stdout).to.not.contain('2023-06-22T10:00:00Z')

            // check for file2
            expect(ctx.stdout).to.contain('610be8e6959dbad9c7e9e5e2')
            expect(ctx.stdout).to.contain('file2.txt')
            expect(ctx.stdout).to.contain('2.048 Kb')
            expect(ctx.stdout).to.contain('2023-06-26T10:00:00Z')
            expect(ctx.stdout).to.contain(100)
            expect(ctx.stdout).to.not.contain('2023-06-24T10:00:00Z')
            expect(ctx.stdout).to.not.contain('2023-06-25T10:00:00Z')
        })

    test.stdout()
        .nock(baseUrl, (client) =>
            client.get('/list').reply(200, {
                data: sampleResponse
            })
        )
        .command(['list', '--extended'])
        .it('can get the list of files with extended flag', (ctx) => {
            // check createdAt date for file1
            expect(ctx.stdout).to.contain('2023-06-21T10:00:00Z')

            // check createdAt date for file2
            expect(ctx.stdout).to.contain('2023-06-24T10:00:00Z')
        })
})
