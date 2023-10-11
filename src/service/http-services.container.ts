import {
  DecentralizedEntityHttpService,
  DeploymentHttpService,
  HttpServicesContainer,
  IndexingHttpService,
  MultiSignProposalHttpService,
  NftProxyHttpService,
  TokenAsAServiceDeployerHttpService
} from "@unleashed-business/opendapps-cloud-ts-commons";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NestHttpServicesContainer extends HttpServicesContainer {
  constructor(baseUrl: string) {
    super(
      new DecentralizedEntityHttpService(baseUrl),
      new TokenAsAServiceDeployerHttpService(baseUrl),
      new NftProxyHttpService(baseUrl),
      new MultiSignProposalHttpService(baseUrl),
      new IndexingHttpService(baseUrl),
      new DeploymentHttpService(baseUrl)
    );
  }
}
