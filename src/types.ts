export interface UserConfigOptions {
    accessToken?: string
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
    lastDownloadedAt?: string
}

export interface ApiResponse<T> {
    status: 'error' | 'success'
    message: string
    data: T
}
