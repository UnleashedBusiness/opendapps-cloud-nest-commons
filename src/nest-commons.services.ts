import { Provider } from "@nestjs/common";
import {
  NotificationService,
  ReadOnlyWeb3ConnectionService,
  TransactionRunningHelperService
} from "@unleashed-business/ts-web3-commons";
import { WEB3_CONNECTION, WEB3_CONTRACT_TOOLKIT_DI_TOKEN } from "./nest-commons.const";
import  NestWeb3ServicesContainer  from "./service/web3-services.container";
import NftStorageClient from "@unleashed-business/ts-web3-commons/dist/storage/nft-storage.client";
import ContractToolkitService from "@unleashed-business/ts-web3-commons/dist/contract/utils/contract-toolkit.service";

export const nestCommonsServices: Provider[] = [
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
];