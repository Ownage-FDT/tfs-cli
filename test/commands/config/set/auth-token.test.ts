import { expect, test } from '@oclif/test'
import { ux } from '@oclif/core'
import sinon from 'sinon'

describe('config:set:auth-token', function () {
    const baseUrl = 'https://api.trytfs.com'

    test.stub(ux.action, 'start', sinon.stub())
        .stub(ux.action, 'stop', sinon.stub())
        .stdout()
        .nock(baseUrl, (client) =>
            client.get('/whoami').reply(200, {
                data: { name: 'Test User' }
            })
        )
        .command(['config:set:auth-token', 'test-token'])
        .it('authenticates and stores the access token', (ctx) => {
            expect(ctx.stdout).to.contain('Authenticated successfully as Test User')
        })

    test.nock(baseUrl, (client) => client.get('/whoami').reply(401))
        .stdout()
        .command(['config:set:auth-token', 'invalid-test-token-123'])
        .catch((error) =>
            expect(error.message).to.contain('Unauthorized. Please check your access token and try again.')
        )
        .it('throws an error if the access token is invalid')
})
