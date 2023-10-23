import { DynamicModule, Module } from "@nestjs/common";
import { nestCommonsServices } from "./nest-commons.services";
import NestCommonsCoreModule from "./nest-commons-core.module";

@Module({
  providers: [...nestCommonsServices],
  exports: [...nestCommonsServices],
})
export default class NestCommonsModule {
  public static forRoot(config: {
    baseHttpBackendUrl: string;
    nftStorageBaseUrl?: string | undefined;
    nftStorageAuthToken?: string | undefined;
  }): DynamicModule {
    return {
      module: NestCommonsModule,
      imports: [NestCommonsCoreModule.forRoot(config)]
    }
  }
}
