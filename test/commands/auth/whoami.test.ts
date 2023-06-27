import { expect, test } from '@oclif/test'

describe('auth:whoami', function () {
    const baseUrl = process.env.TFS_HOST_URL ?? 'http://localhost:3000'

    test.stdout()
        .nock(baseUrl, (client) => client.get('/whoami').reply(200, { data: { name: 'Test User' } }))
        .command(['auth:whoami'])
        .it('shows the currently authenticated user information', (ctx) => {
            expect(ctx.stdout).to.contain('You are currently authenticated as Test User')
        })

    test.stdout()
        .nock(baseUrl, (client) => client.get('/whoami').reply(401))
        .command(['auth:whoami'])
        .catch((error) =>
            expect(error.message).to.contain('Unauthorized. Please check your access token and try again.')
        )
        .it('throws an error if the user is not authenticated')
})
