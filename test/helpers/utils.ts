import * as path from 'node:path'
import mockFs from 'mock-fs'

export const mockFileSystem = () => {
    const mockFsConfig = {
        'package.json': mockFs.load(path.resolve(__dirname, '../../package.json')),
        'tsconfig.json': mockFs.load(path.resolve(__dirname, '../../tsconfig.json')),
        src: mockFs.load(path.resolve(__dirname, '../../src')),
        test: mockFs.load(path.resolve(__dirname, '../../test')),
        node_modules: mockFs.load(path.resolve(__dirname, '../../node_modules'))
    }

    mockFs(mockFsConfig)
}
