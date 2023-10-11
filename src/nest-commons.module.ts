import { Module } from "@nestjs/common";
import { nestCommonsServices } from "./nest-commons.services";

@Module({
  providers: [
    ...nestCommonsServices
  ],
  exports: [
    ...nestCommonsServices
  ]
})
export default class NestCommonsModule {

}