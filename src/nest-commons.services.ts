import { Provider } from "@nestjs/common";
import {
  NotificationService,
  ReadOnlyWeb3ConnectionService,
  TransactionRunningHelperService
} from "@unleashed-business/ts-web3-commons";
import { WEB3_CONNECTION } from "./nest-commons.const";
import  NestWeb3ServicesContainer  from "./service/web3-services.container";

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
  NestWeb3ServicesContainer
];