import {ClientConfig} from "hazelcast-client/lib/config/Config.js";

export class CacheConfig {
    constructor(
        public readonly hazelcastConfig: ClientConfig,
        public readonly enabled: boolean
    ) {
    }


}