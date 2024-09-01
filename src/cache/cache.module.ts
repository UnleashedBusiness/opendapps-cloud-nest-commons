import {DynamicModule, Module} from "@nestjs/common";
import {CacheService} from "./cache.service.js";
import {CacheConfig} from "./cache.config.js";
import {CACHE_CONFIG_DI_TOKEN} from "./cache.const.js";

@Module({
    imports: [],
    exports: [CacheService],
    providers: [CacheService],
})
export class CacheModule {
    public static forRoot(config: CacheConfig): DynamicModule {
        return {
            module: CacheModule,
            providers: [
                {
                    provide: CACHE_CONFIG_DI_TOKEN,
                    useValue: config,
                },
                {
                    provide: CacheConfig,
                    useValue: config
                }
            ],
            exports: [CACHE_CONFIG_DI_TOKEN, CacheConfig],
            global: true
        };
    }
}