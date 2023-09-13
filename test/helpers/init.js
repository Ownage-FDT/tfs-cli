/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('node:path')
process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json')
process.env.NODE_ENV = 'test'
process.env.TFS_HOST_URL = 'http://localhost:3000'

global.oclif = global.oclif || {}
global.oclif.columns = 80
