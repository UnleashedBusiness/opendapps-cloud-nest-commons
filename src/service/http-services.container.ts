import {
    DecentralizedEntityHttpService,
    DeploymentHttpService,
    HttpServicesContainer,
    IndexingHttpService,
    MultiSignProposalHttpService,
    NftProxyHttpService, OwnershipHttpService,
    StatsHttpService,
    TokenAsAServiceDeployerHttpService
} from "@unleashed-business/opendapps-cloud-ts-commons";
import {Inject, Injectable} from "@nestjs/common";
import {HTTP_SERVICE_BASE_URL_TOKEN} from "../nest-commons.const.js";
import {BlocktimeHttpService} from "@unleashed-business/opendapps-cloud-ts-commons/dist/web2/blocktime-http.service.js";

@Injectable()
export default class NestHttpServicesContainer extends HttpServicesContainer {
    constructor(@Inject(HTTP_SERVICE_BASE_URL_TOKEN) baseUrl: string) {
        super(
            new DecentralizedEntityHttpService(baseUrl),
            new TokenAsAServiceDeployerHttpService(baseUrl),
            new NftProxyHttpService(baseUrl),
            new MultiSignProposalHttpService(baseUrl),
            new IndexingHttpService(baseUrl),
            new DeploymentHttpService(baseUrl),
            new BlocktimeHttpService(baseUrl),
            new StatsHttpService(baseUrl),
            new OwnershipHttpService(baseUrl),
        );
    }
}
