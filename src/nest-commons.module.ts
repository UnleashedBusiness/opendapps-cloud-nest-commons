import { DynamicModule, Module } from "@nestjs/common";
import { nestCommonsServices } from "./nest-commons.services";
import { HttpServicesContainer } from "@unleashed-business/opendapps-cloud-ts-commons";
import { HTTP_SERVICE_BASE_URL_TOKEN } from "./nest-commons.const";

@Module({
  providers: [...nestCommonsServices],
  exports: [...nestCommonsServices],
})
export default class NestCommonsModule {
  public static forRoot(config: { baseHttpBackendUrl: string }): DynamicModule {
    return {
      module: NestCommonsModule,
      providers: [
        {
          provide: HTTP_SERVICE_BASE_URL_TOKEN,
          useValue: config.baseHttpBackendUrl,
        },
        HttpServicesContainer
      ]
    };
  }
}
