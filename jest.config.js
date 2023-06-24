/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 60000,
    setupFilesAfterEnv: ['<rootDir>/test/helpers/init.js']
}
