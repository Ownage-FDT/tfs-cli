import { expect, test } from '@oclif/test'

describe('remove', function () {
    const baseUrl = 'https://api.trytfs.com'
    const fileId = '610be8e6959dbad9c7e9e5e1'

    test.stdout()
        .nock(baseUrl, (client) => client.delete(`/remove/${fileId}`).reply(200))
        .command(['remove', fileId])
        .it('can remove a file by its id', (ctx) => {
            expect(ctx.stdout).to.contain(`File ${fileId} removed successfully`)
        })
})
