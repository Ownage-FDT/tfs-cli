import cryptoJs from 'crypto-js'

export const encryptFile = (fileBuffer: Buffer, encryptionKey: string) => {
    try {
        const encryptedBytes = cryptoJs.AES.encrypt(fileBuffer.toString('base64'), encryptionKey)

        return Buffer.from(encryptedBytes.toString(), 'base64')
    } catch {
        throw new Error('Encryption failed. Please check the encryption key.')
    }
}

export const decryptFile = (fileBuffer: Buffer, encryptionKey: string) => {
    try {
        const decryptedBytes = cryptoJs.AES.decrypt(fileBuffer.toString('base64'), encryptionKey)

        return Buffer.from(decryptedBytes.toString(cryptoJs.enc.Utf8), 'base64')
    } catch {
        throw new Error('Decryption failed. Incorrect encryption key or corrupted file.')
    }
}
