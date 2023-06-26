import { expect, test } from '@oclif/test'
import { ux } from '@oclif/core'
import sinon from 'sinon'

describe('auth:add-token', function () {
    const baseUrl = process.env.TFS_HOST_URL ?? 'http://localhost:3000'
    const testInstance = test.stub(ux.action, 'start', sinon.stub()).stub(ux.action, 'stop', sinon.stub())

    testInstance
        .stdout()
        .nock(baseUrl, (client) =>
            client.get('/whoami').reply(200, {
                data: { name: 'Test User' }
            })
        )
        .command(['auth:add-token', 'test-token'])
        .it('authenticates and stores the access token', (ctx) => {
            expect(ctx.stdout).to.contain('Authenticated successfully as Test User')
        })

    testInstance
        .stdout()
        .nock(baseUrl, (client) => client.get('/whoami').reply(401))
        .command(['auth:add-token', 'invalid-test-token'])
        .catch((error) =>
            expect(error.message).to.contain('Unauthorized. Please check your access token and try again.')
        )
        .it('throws an error if the access token is invalid')
})
