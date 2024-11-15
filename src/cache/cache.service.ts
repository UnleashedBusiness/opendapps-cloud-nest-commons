import {Injectable, Logger} from "@nestjs/common";
import {HazelcastClient} from "hazelcast-client/lib/HazelcastClient.js";
import {CacheConfig} from "./cache.config.js";
import {IMap} from "hazelcast-client/lib/proxy";

@Injectable()
export class CacheService {
    private service?: HazelcastClient = undefined;
    private namespaces: Record<string, IMap<string, any>> = {};
    private isConnected = false;

    constructor(
        private cacheConfig: CacheConfig
    ) {
        if (cacheConfig.enabled) {
            HazelcastClient.newHazelcastClient({
                ...this.cacheConfig.hazelcastConfig,
                lifecycleListeners: [
                    state => {
                        this.isConnected = state === "CONNECTED"
                    }
                ]
            })
                .then(x => this.service = x);
        }
    }

    public async get<T>(namespace: string, key: string): Promise<T | undefined> {
        if (!this.cacheConfig.enabled) return undefined;

        try {
            const namespaceInstance = await this.getNamespace<T>(namespace);
            const item = await namespaceInstance.get(key);
            if (item === null || item === undefined) {
                return undefined;
            }

            return item;
        } catch (e: any) {
            Logger.warn(`Error while trying to receive cache entry: ${e?.stack}`)
            return undefined;
        }
    }

    public async set<T>(namespace: string, key: string, value: T, cacheLife: number): Promise<void> {
        if (!this.cacheConfig.enabled) return;

        try {
            const namespaceInstance = await this.getNamespace<T>(namespace);
            await namespaceInstance.set(key, value, cacheLife);
        } catch (e) {
        }
    }

    public async isLocked<T>(namespace: string, key: string): Promise<boolean> {
        if (!this.cacheConfig.enabled) return false;

        const namespaceInstance = await this.getNamespace<T>(namespace);
        return namespaceInstance.isLocked(key);
    }

    public async lock<T>(namespace: string, key: string, lockTimeout?: number): Promise<void> {
        if (!this.cacheConfig.enabled) return;

        const namespaceInstance = await this.getNamespace<T>(namespace);
        await namespaceInstance.lock(key, lockTimeout);
    }

    public async unlock<T>(namespace: string, key: string): Promise<void> {
        if (!this.cacheConfig.enabled) return;

        const namespaceInstance = await this.getNamespace<T>(namespace);
        await namespaceInstance.unlock(key);
    }

    public async forceUnlock<T>(namespace: string, key: string): Promise<void> {
        if (!this.cacheConfig.enabled) return;

        const namespaceInstance = await this.getNamespace<T>(namespace);
        await namespaceInstance.forceUnlock(key);
    }

    private client(): HazelcastClient {
        if (this.service === undefined) {
            throw new Error("Service not initialized yet...");
        }

        if (!this.isConnected) {
            throw new Error("Service not connected...");
        }

        return this.service;
    }

    private async getNamespace<T>(namespace: string): Promise<IMap<string, T>> {
        const client = this.client();
        if (this.namespaces[namespace] === undefined) {
            this.namespaces[namespace] = await client.getMap<string, T>(namespace);
        }

        return this.namespaces[namespace];
    }
}