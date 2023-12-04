export interface UserConfigOptions {
    accessToken?: string
    encryptionKey?: string
}

export interface Account {
    id: string
    name: string
    email: string
}

export interface File extends Record<string, unknown> {
    _id: string
    name: string
    size: number
    expiresAt: string
    createdAt: string
    totalDownloads?: number
    lastDownloadedAt?: string
}

export interface ListFilesResponse {
    items: File[]
    meta: {
        hasMore: boolean
    }
}

export interface ApiResponse<T> {
    status: 'error' | 'success'
    message: string
    data: T
}
