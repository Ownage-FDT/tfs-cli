export interface UserConfigOptions {
    accessToken?: string
}

export interface Account {
    id: string
    name: string
    email: string
}

export interface ApiResponse<T> {
    status: 'error' | 'success'
    message: string
    data: T
}
