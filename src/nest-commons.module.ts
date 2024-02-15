import { DynamicModule, Module } from "@nestjs/common";
import NestCommonsCoreModule from "./nest-commons-core.module.js";
import { ContractGeneralConfig } from "@unleashed-business/ts-web3-commons";

@Module({
  providers: [],
  exports: [],
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
