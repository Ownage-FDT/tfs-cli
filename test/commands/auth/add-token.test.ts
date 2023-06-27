import { expect, test } from '@oclif/test'
import { ux } from '@oclif/core'
import sinon from 'sinon'
import mockFs from 'mock-fs'
import * as fs from 'fs-extra'
import { mockFileSystem } from '../../helpers/utils'

describe('auth:add-token', function () {
    const baseUrl = process.env.TFS_HOST_URL ?? 'http://localhost:3000'

    beforeEach(function () {
        mockFileSystem()
    })

    afterEach(function () {
        mockFs.restore()
    })

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
            // read the config file
            const config = fs.readJSONSync(`${ctx.config.home}/.${ctx.config.name}rc`)

            // check that the access token was stored
            expect(config.accessToken).to.equal('test-token')
            expect(ctx.stdout).to.contain('Authenticated successfully as Test User')
        })

    testInstance
        .stdout()
        .nock(baseUrl, (client) => client.get('/whoami').reply(401))
        .command(['auth:add-token', 'invalid-test-token'])
        .catch((error) =>
            expect(error.message).to.contain('Unauthorized. Please check your access token and try again.')
        )
        .it('throws an error if the access token is invalid', (ctx) => {
            // read the config file
            const config = fs.readJSONSync(`${ctx.config.home}/.${ctx.config.name}rc`)

            // check that the access token was not stored
            expect(config.accessToken).to.not.equal('invalid-test-token')
        })
})
