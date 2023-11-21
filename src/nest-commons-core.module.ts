import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import {
  HTTP_SERVICE_BASE_URL_TOKEN, WEB3_CONTRACT_TOOLKIT_DI_TOKEN,
  WEB3_STORAGE_DI_TOKEN
} from "./nest-commons.const";
import { HttpServicesContainer } from "@unleashed-business/opendapps-cloud-ts-commons";
import NftStorageClient from "@unleashed-business/ts-web3-commons/dist/storage/nft-storage.client";
import { ReadOnlyWeb3ConnectionService, TransactionRunningHelperService } from "@unleashed-business/ts-web3-commons";
import ContractToolkitService from "@unleashed-business/ts-web3-commons/dist/contract/utils/contract-toolkit.service";
import NestWeb3ServicesContainer from "./service/web3-services.container";
import ContractGeneralConfig from "@unleashed-business/ts-web3-commons/dist/contract/utils/contract-general.config";

const defaultGeneralContractConfig: ContractGeneralConfig = {
  estimateGasMultiplier: 1.15,
  executionConfirmation: 1,
  executionReceiptTimeout: 10_000
}

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
    contractGeneralConfig?: ContractGeneralConfig
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: HTTP_SERVICE_BASE_URL_TOKEN,
        useValue: config.baseHttpBackendUrl,
      },
      {
        provide: WEB3_CONTRACT_TOOLKIT_DI_TOKEN,
        inject: [TransactionRunningHelperService, ReadOnlyWeb3ConnectionService],
        useFactory: (trh: TransactionRunningHelperService, web3: ReadOnlyWeb3ConnectionService) =>
          new ContractToolkitService(web3, trh, config.contractGeneralConfig ?? defaultGeneralContractConfig),
      },
      HttpServicesContainer,
      NestWeb3ServicesContainer
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
