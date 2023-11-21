import { DynamicModule, Module } from "@nestjs/common";
import { nestCommonsServices } from "./nest-commons.services";
import NestCommonsCoreModule from "./nest-commons-core.module";
import ContractGeneralConfig from "@unleashed-business/ts-web3-commons/dist/contract/utils/contract-general.config";

@Module({
  providers: [...nestCommonsServices],
  exports: [...nestCommonsServices],
})
export default class NestCommonsModule {
  public static forRoot(config: {
    baseHttpBackendUrl: string;
    nftStorageBaseUrl?: string | undefined;
    nftStorageAuthToken?: string | undefined;
    contractGeneralConfig?: ContractGeneralConfig
  }): DynamicModule {
    return {
      module: NestCommonsModule,
      imports: [NestCommonsCoreModule.forRoot(config)]
    }
  }
}
