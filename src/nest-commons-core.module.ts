import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import {
  HTTP_SERVICE_BASE_URL_TOKEN,
  WEB3_STORAGE_DI_TOKEN,
} from "./nest-commons.const";
import { HttpServicesContainer } from "@unleashed-business/opendapps-cloud-ts-commons";
import NftStorageClient from "@unleashed-business/ts-web3-commons/dist/storage/nft-storage.client";

@Global()
@Module({
  imports: [],
  providers: [],
  exports: [],
  controllers: [],
})
export default class NestCommonsCoreModule {
  public static forRoot(config: {
    baseHttpBackendUrl: string;
    nftStorageBaseUrl?: string | undefined;
    nftStorageAuthToken?: string | undefined;
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: HTTP_SERVICE_BASE_URL_TOKEN,
        useValue: config.baseHttpBackendUrl,
      },
      HttpServicesContainer,
    ];
    const exports: (Provider | string)[] = [
      HttpServicesContainer,
      HTTP_SERVICE_BASE_URL_TOKEN,
    ];
    if (
      config.nftStorageBaseUrl !== undefined &&
      config.nftStorageAuthToken !== undefined
    ) {
      providers.push(
        {
          provide: NftStorageClient,
          useFactory: () =>
            new NftStorageClient(
              config.nftStorageBaseUrl,
              config.nftStorageAuthToken,
            ),
        },
        {
          provide: WEB3_STORAGE_DI_TOKEN,
          inject: [NftStorageClient],
          useFactory: (nftStorage: NftStorageClient) => nftStorage,
        },
      );
      exports.push(WEB3_STORAGE_DI_TOKEN, NftStorageClient);
    }
    return {
      module: NestCommonsCoreModule,
      providers: providers,
      exports: exports,
    };
  }
}
