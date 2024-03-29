import { Command, Interfaces } from '@oclif/core'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { UserConfigOptions } from './types'
import * as path from 'node:path'
import * as fs from 'fs-extra'
import chalk from 'chalk'

export type Args<T extends typeof Command> = Interfaces.InferredFlags<T['args']>
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
    protected args!: Args<T>
    protected flags!: Flags<T>
    private _configFilePath: string = path.join(this.config.home, `.tfsrc`)

    public async init(): Promise<void> {
        await super.init()

        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            args: this.ctor.args,
            strict: this.ctor.strict
        })
        this.flags = flags as Flags<T>
        this.args = args as Args<T>

        // create config file in the home directory if it doesn't exist
        if (!fs.existsSync(this._configFilePath)) {
            fs.writeJSONSync(this._configFilePath, {}, { spaces: 2 })
        }
    }

    get client(): AxiosInstance {
        return this.initiateClient()
    }

    private initiateClient(): AxiosInstance {
        const client = axios.create({
            baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.trytfs.com',
            headers: {
                Accept: 'application/json',
                'User-Agent': this.config.userAgent
            },
            timeout: 60000
        })

        // add an interceptor to add the access token to the request headers
        client.interceptors.request.use(async (config) => {
            if (config.headers.Authorization) {
                return config
            }

            const accessToken = this.getConfigValue('accessToken')
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`
            }

            return config
        })

        // handle any errors that occur during the request
        client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<{ message: string }>) => {
                throw error
            }
        )

        return client
    }

    setConfigValue<T extends keyof UserConfigOptions>(key: T, value: UserConfigOptions[T]) {
        const currentConfig = fs.readJSONSync(this._configFilePath)

        fs.writeJSONSync(this._configFilePath, { ...currentConfig, [key]: value }, { spaces: 2 })
    }

    getConfigValue<T extends keyof UserConfigOptions>(key: T): UserConfigOptions[T] {
        const currentConfig = fs.readJSONSync(this._configFilePath)

        return currentConfig[key]
    }

    protected async catch(error: any): Promise<any> {
        if (error instanceof AxiosError) {
            const status = error.response?.status ?? error.status
            const message = error.response?.data?.message ?? error.message

            if (status === 401) {
                return super.catch(new Error(chalk.red('Unauthorized. Please check your access token and try again.')))
            }

            return super.catch(new Error(chalk.red(message)))
        }

        return super.catch(new Error(chalk.red(error.message)))
    }
}
