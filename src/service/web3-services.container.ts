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
  Erc20TokenContract, TransactionRunningHelperService,
  UniswapFactoryContract, ReadOnlyWeb3Connection,
  UniswapPairContract,
  UniswapRouterContract, WethContract
} from "@unleashed-business/ts-web3-commons";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NestWeb3ServicesContainer extends Web3ServicesContainer {
  constructor(
    walletConnection: ReadOnlyWeb3Connection,
    transactionHelper: TransactionRunningHelperService
  ) {
    const erc20 = new Erc20TokenContract(walletConnection, transactionHelper);
    super(
      new OpenDAppsCloudRouterContract(walletConnection, transactionHelper),
      new DecentralizedEntityDeployerContract(walletConnection, transactionHelper),
      new TokenAsAServiceDeployerContract(erc20, walletConnection, transactionHelper),
      new StakingAsAServiceDeployerContract(walletConnection, transactionHelper),
      new DecentralizedEntityInterfaceContract(walletConnection, transactionHelper),
      new GovernorInterfaceContract(walletConnection, transactionHelper),
      new SingleOwnerEntityContract(walletConnection, transactionHelper),
      new MultiSignEntityContract(walletConnection, transactionHelper),
      new MultiSignSharesEntityContract(walletConnection, transactionHelper),
      erc20,
      new TokenAsAServiceContract(walletConnection, transactionHelper),
      new StakingAsAServiceContract(erc20, walletConnection, transactionHelper),
      new DymanicTokenomicsContractService(erc20, walletConnection, transactionHelper),
      new InflationContract(erc20, walletConnection, transactionHelper),
      new TokenLiquidityTreasuryContract(erc20, walletConnection, transactionHelper),
      new TokenRewardsTreasuryContract(erc20, walletConnection, transactionHelper),
      new UniswapRouterContract(erc20, walletConnection, transactionHelper),
      new UniswapPairContract(walletConnection, transactionHelper),
      new UniswapFactoryContract(walletConnection, transactionHelper),
      new OwnershipNftCollectionContract(walletConnection, transactionHelper),
      new OwnershipSharesNftCollectionContract(walletConnection, transactionHelper),
      new ReferralEngineContract(erc20, walletConnection, transactionHelper),
      new ContractDeployerContract(erc20, walletConnection, transactionHelper),
      new WethContract(erc20, walletConnection, transactionHelper),
    );
  }
}
