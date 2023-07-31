import cryptoJs from 'crypto-js'

export const encryptFile = (fileBuffer: Buffer, encryptionKey: string) => {
    const encryptedBytes = cryptoJs.AES.encrypt(fileBuffer.toString('base64'), encryptionKey)

    return Buffer.from(encryptedBytes.toString(), 'base64')
}

export const decryptFile = (fileBuffer: Buffer, encryptionKey: string) => {
    const decryptedBytes = cryptoJs.AES.decrypt(fileBuffer.toString('base64'), encryptionKey)

    return Buffer.from(decryptedBytes.toString(), 'base64')
}
