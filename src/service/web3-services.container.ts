import {
  ContractDeployerContract,
  DecentralizedEntityDeployerContract,
  DecentralizedEntityInterfaceContract,
  DymanicTokenomicsContractService,
  GovernorInterfaceContract,
  InflationContract,
  MultiSignEntityContract,
  MultiSignSharesEntityContract,
  OpenDAppsCloudRouterContract,
  OwnershipNftCollectionContract,
  OwnershipSharesNftCollectionContract,
  ReferralEngineContract,
  SingleOwnerEntityContract,
  StakingAsAServiceContract,
  StakingAsAServiceDeployerContract,
  TokenAsAServiceContract,
  TokenAsAServiceDeployerContract,
  TokenLiquidityTreasuryContract,
  TokenRewardsTreasuryContract, Web3ServicesContainer
} from "@unleashed-business/opendapps-cloud-ts-commons";
import {
  Erc20TokenContract,
  UniswapFactoryContract,
  UniswapPairContract,
  UniswapRouterContract, WethContract
} from "@unleashed-business/ts-web3-commons";
import { Inject, Injectable } from "@nestjs/common";
import { WEB3_CONTRACT_TOOLKIT_DI_TOKEN } from "../nest-commons.const";
import ContractToolkitService from "@unleashed-business/ts-web3-commons/dist/contract/utils/contract-toolkit.service";

@Injectable()
export default class NestWeb3ServicesContainer extends Web3ServicesContainer {
  constructor(
    @Inject(WEB3_CONTRACT_TOOLKIT_DI_TOKEN)
      toolkit: ContractToolkitService
  ) {
    const erc20 = new Erc20TokenContract(toolkit);
    super(
      new OpenDAppsCloudRouterContract(toolkit),
      new DecentralizedEntityDeployerContract(toolkit),
      new TokenAsAServiceDeployerContract(erc20, toolkit),
      new StakingAsAServiceDeployerContract(toolkit),
      new DecentralizedEntityInterfaceContract(toolkit),
      new GovernorInterfaceContract(toolkit),
      new SingleOwnerEntityContract(toolkit),
      new MultiSignEntityContract(toolkit),
      new MultiSignSharesEntityContract(toolkit),
      erc20,
      new TokenAsAServiceContract(toolkit),
      new StakingAsAServiceContract(erc20, toolkit),
      new DymanicTokenomicsContractService(erc20, toolkit),
      new InflationContract(erc20, toolkit),
      new TokenLiquidityTreasuryContract(erc20, toolkit),
      new TokenRewardsTreasuryContract(erc20, toolkit),
      new UniswapRouterContract(erc20, toolkit),
      new UniswapPairContract(toolkit),
      new UniswapFactoryContract(toolkit),
      new OwnershipNftCollectionContract(toolkit),
      new OwnershipSharesNftCollectionContract(toolkit),
      new ReferralEngineContract(toolkit),
      new ContractDeployerContract(erc20, toolkit),
      new WethContract(erc20, toolkit)
    );
  }
}
