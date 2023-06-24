/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line unicorn/prefer-module
const path = require('node:path')

process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json')
process.env.TFS_HOST_URL = 'http://localhost:3000'

global.oclif = global.oclif || {}
global.oclif.columns = 80
