import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import {
  HTTP_SERVICE_BASE_URL_TOKEN,
  WEB3_CONNECTION,
  WEB3_CONTRACT_TOOLKIT_DI_TOKEN,
  WEB3_STORAGE_DI_TOKEN,
} from "./nest-commons.const";
import { HttpServicesContainer } from "@unleashed-business/opendapps-cloud-ts-commons";
import NftStorageClient from "@unleashed-business/ts-web3-commons/dist/storage/nft-storage.client";
import {
  ContractGeneralConfig,
  ContractToolkitService,
  NotificationService,
  ReadOnlyWeb3ConnectionService,
  TransactionRunningHelperService,
} from "@unleashed-business/ts-web3-commons";
import NestWeb3ServicesContainer from "./service/web3-services.container";

const defaultGeneralContractConfig: ContractGeneralConfig = {
  estimateGasMultiplier: 1.15,
  executionConfirmation: 1,
  executionReceiptTimeout: 10_000,
  blockMintingTolerance: 30,
  blockMintingToleranceIntervalMilliseconds: 10_000,
};

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
    contractGeneralConfig?: ContractGeneralConfig;
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: HTTP_SERVICE_BASE_URL_TOKEN,
        useValue: config.baseHttpBackendUrl,
      },
      {
        provide: ContractToolkitService,
        inject: [
          TransactionRunningHelperService,
          ReadOnlyWeb3ConnectionService,
        ],
        useFactory: (
          trh: TransactionRunningHelperService,
          web3: ReadOnlyWeb3ConnectionService,
        ) =>
          new ContractToolkitService(
            web3,
            trh,
            config.contractGeneralConfig ?? defaultGeneralContractConfig,
          ),
      },
      {
        provide: WEB3_CONTRACT_TOOLKIT_DI_TOKEN,
        useExisting: ContractToolkitService,
      },
      {
        provide: NotificationService,
        useValue: new NotificationService(),
      },
      {
        provide: ReadOnlyWeb3ConnectionService,
        useFactory: () => new ReadOnlyWeb3ConnectionService(),
      },
      {
        provide: WEB3_CONNECTION,
        inject: [ReadOnlyWeb3ConnectionService],
        useFactory: (service: ReadOnlyWeb3ConnectionService) => service,
      },
      {
        provide: TransactionRunningHelperService,
        inject: [NotificationService],
        useFactory: (notificationService: NotificationService) =>
          new TransactionRunningHelperService(notificationService),
      },
      {
        provide: NestWeb3ServicesContainer,
        inject: [ContractToolkitService],
        useFactory: (cts: ContractToolkitService) =>
          new NestWeb3ServicesContainer(cts),
      },
      HttpServicesContainer,
    ];
    const exports: (Provider | string)[] = [
      HttpServicesContainer,
      HTTP_SERVICE_BASE_URL_TOKEN,
      NotificationService,
      TransactionRunningHelperService,
      WEB3_CONNECTION,
      WEB3_CONTRACT_TOOLKIT_DI_TOKEN,
      NestWeb3ServicesContainer
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
