import { DynamicModule, Module, Provider } from "@nestjs/common";
import { nestCommonsServices } from "./nest-commons.services";
import { HttpServicesContainer } from "@unleashed-business/opendapps-cloud-ts-commons";
import {
  HTTP_SERVICE_BASE_URL_TOKEN,
  WEB3_STORAGE_DI_TOKEN,
} from "./nest-commons.const";
import NftStorageClient from "@unleashed-business/ts-web3-commons/dist/storage/nft-storage.client";

@Module({
  providers: [...nestCommonsServices],
  exports: [...nestCommonsServices, WEB3_STORAGE_DI_TOKEN],
})
export default class NestCommonsModule {
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
    }
    return {
      module: NestCommonsModule,
      providers: providers,
    };
  }
}
