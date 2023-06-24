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
    private _configFilePath: string = path.join(this.config.home, `.${this.config.name}rc`)

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
            // TODO: use the host url from the config
            baseURL: process.env.TFS_HOST_URL ?? 'http://localhost:3000',
            headers: {
                Accept: 'application/json',
                'User-Agent': this.config.userAgent
            }
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

    async catch(error: Error & { exitCode?: number }): Promise<any> {
        if (error instanceof AxiosError) {
            if (error.status === 401) {
                this.error(chalk.red('Unauthorized. Please check your access token and try again.'))
            }

            this.error(chalk.red(error.response?.data?.message ?? error.message))
        }

        this.error(chalk.red(error.message), { exit: error.exitCode ?? 1 })
    }
}
