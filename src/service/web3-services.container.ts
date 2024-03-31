import {Web3ServicesContainer} from "@unleashed-business/opendapps-cloud-ts-commons";
import {Inject, Injectable} from "@nestjs/common";
import {WEB3_CONTRACT_TOOLKIT_DI_TOKEN} from "../nest-commons.const.js";
import {
    ContractToolkitService,
    Web3Contract,
} from "@unleashed-business/ts-web3-commons";
import {Erc20Abi, Erc20AbiFunctional} from "@unleashed-business/ts-web3-commons/dist/abi/erc20.abi.js";
import {
    OpenDAppsCloudRouterAbi, OpenDAppsCloudRouterAbiFunctional
} from "@unleashed-business/opendapps-cloud-ts-abi/dist/abi/opendapps-cloud-router.abi.js";
import {
    AssetBackingAbi,
    AssetBackingAbiFunctional,
    BaselineInsuranceServiceDeployerAbi,
    BaselineInsuranceServiceDeployerAbiFunctional, ContractDeployerAbi, ContractDeployerAbiFunctional,
    DecentralizedEntityDeployerAbi,
    DecentralizedEntityDeployerAbiFunctional,
    DecentralizedEntityInterfaceAbi,
    DecentralizedEntityInterfaceAbiFunctional,
    DynamicTokenomicsAbi,
    DynamicTokenomicsAbiFunctional,
    InflationAbi,
    InflationAbiFunctional,
    MultiSignEntityAbi,
    MultiSignEntityAbiFunctional,
    MultiSignSharesEntityAbi,
    MultiSignSharesEntityAbiFunctional,
    OwnershipNFTCollectionAbi,
    OwnershipNFTCollectionAbiFunctional, OwnershipSharesNFTCollectionAbi,
    OwnershipSharesNFTCollectionAbiFunctional,
    ProposalGovernorInterfaceAbi,
    ProposalGovernorInterfaceAbiFunctional, ReferralsEngineAbi, ReferralsEngineAbiFunctional,
    SingleOwnerEntityAbi,
    SingleOwnerEntityAbiFunctional,
    StakingAsAServiceAbi,
    StakingAsAServiceAbiFunctional,
    StakingAsAServiceDeployerAbi,
    StakingAsAServiceDeployerAbiFunctional,
    TokenAsAServiceAbi,
    TokenAsAServiceAbiFunctional,
    TokenAsAServiceDeployerAbi,
    TokenAsAServiceDeployerAbiFunctional,
    TokenLiquidityTreasuryAbi,
    TokenLiquidityTreasuryAbiFunctional,
    TokenRewardsTreasuryAbi,
    TokenRewardsTreasuryAbiFunctional
} from "@unleashed-business/opendapps-cloud-ts-abi";
import {
    UniswapRouterAbi,
    UniswapRouterAbiFunctional
} from "@unleashed-business/ts-web3-commons/dist/abi/uniswap-router.abi.js";
import {
    UniswapPairAbi,
    UniswapPairAbiFunctional
} from "@unleashed-business/ts-web3-commons/dist/abi/uniswap-pair.abi.js";
import {
    UniswapFactoryAbi,
    UniswapFactoryAbiFunctional
} from "@unleashed-business/ts-web3-commons/dist/abi/uniswap-factory.abi.js";
import {WETHAbi, WETHAbiFunctional} from "@unleashed-business/ts-web3-commons/dist/abi/weth.abi.js";
import {
    PresaleServiceAbi,
    PresaleServiceAbiFunctional
} from "@unleashed-business/opendapps-cloud-ts-abi/dist/abi/presale-service.abi.js";
import {
    PresaleServiceDeployerAbi,
    PresaleServiceDeployerAbiFunctional
} from "@unleashed-business/opendapps-cloud-ts-abi/dist/abi/presale-service-deployer.abi.js";
import {TreasuryAbi, TreasuryAbiFunctional} from "@unleashed-business/opendapps-cloud-ts-abi/dist/abi/treasury.abi.js";
import {
    TreasuryPocketAbi,
    TreasuryPocketAbiFunctional
} from "@unleashed-business/opendapps-cloud-ts-abi/dist/abi/treasury-pocket.abi.js";
import {
    TreasuryDeployerAbi,
    TreasuryDeployerAbiFunctional
} from "@unleashed-business/opendapps-cloud-ts-abi/dist/abi/treasury-deployer.abi.js";
import {
    VestingDeployerAbi,
    VestingDeployerAbiFunctional
} from "@unleashed-business/opendapps-cloud-ts-abi/dist/abi/vesting-deployer.abi.js";
import {VestingAbi, VestingAbiFunctional} from "@unleashed-business/opendapps-cloud-ts-abi/dist/abi/vesting.abi.js";

@Injectable()
export default class NestWeb3ServicesContainer extends Web3ServicesContainer {
    constructor(
        @Inject(WEB3_CONTRACT_TOOLKIT_DI_TOKEN)
            toolkit: ContractToolkitService,
    ) {
        super(
            new Web3Contract<OpenDAppsCloudRouterAbiFunctional>(toolkit, OpenDAppsCloudRouterAbi),
            new Web3Contract<BaselineInsuranceServiceDeployerAbiFunctional>(toolkit, BaselineInsuranceServiceDeployerAbi),
            new Web3Contract<AssetBackingAbiFunctional>(toolkit, AssetBackingAbi),
            new Web3Contract<DecentralizedEntityDeployerAbiFunctional>(toolkit, DecentralizedEntityDeployerAbi),
            new Web3Contract<TokenAsAServiceDeployerAbiFunctional>(toolkit, TokenAsAServiceDeployerAbi),
            new Web3Contract<StakingAsAServiceDeployerAbiFunctional>(toolkit, StakingAsAServiceDeployerAbi),
            new Web3Contract<DecentralizedEntityInterfaceAbiFunctional>(toolkit, DecentralizedEntityInterfaceAbi),
            new Web3Contract<ProposalGovernorInterfaceAbiFunctional>(toolkit, ProposalGovernorInterfaceAbi),
            new Web3Contract<SingleOwnerEntityAbiFunctional>(toolkit, SingleOwnerEntityAbi),
            new Web3Contract<MultiSignEntityAbiFunctional>(toolkit, MultiSignEntityAbi),
            new Web3Contract<MultiSignSharesEntityAbiFunctional>(toolkit, MultiSignSharesEntityAbi),
            new Web3Contract<Erc20AbiFunctional>(toolkit, Erc20Abi),
            new Web3Contract<TokenAsAServiceAbiFunctional>(toolkit, TokenAsAServiceAbi),
            new Web3Contract<StakingAsAServiceAbiFunctional>(toolkit, StakingAsAServiceAbi),
            new Web3Contract<DynamicTokenomicsAbiFunctional>(toolkit, DynamicTokenomicsAbi),
            new Web3Contract<InflationAbiFunctional>(toolkit, InflationAbi),
            new Web3Contract<TokenLiquidityTreasuryAbiFunctional>(toolkit, TokenLiquidityTreasuryAbi),
            new Web3Contract<TokenRewardsTreasuryAbiFunctional>(toolkit, TokenRewardsTreasuryAbi),
            new Web3Contract<UniswapRouterAbiFunctional>(toolkit, UniswapRouterAbi),
            new Web3Contract<UniswapPairAbiFunctional>(toolkit, UniswapPairAbi),
            new Web3Contract<UniswapFactoryAbiFunctional>(toolkit, UniswapFactoryAbi),
            new Web3Contract<OwnershipNFTCollectionAbiFunctional>(toolkit, OwnershipNFTCollectionAbi),
            new Web3Contract<OwnershipSharesNFTCollectionAbiFunctional>(toolkit, OwnershipSharesNFTCollectionAbi),
            new Web3Contract<ReferralsEngineAbiFunctional>(toolkit, ReferralsEngineAbi),
            new Web3Contract<ContractDeployerAbiFunctional>(toolkit, ContractDeployerAbi),
            new Web3Contract<WETHAbiFunctional>(toolkit, WETHAbi),
            new Web3Contract<PresaleServiceAbiFunctional>(toolkit, PresaleServiceAbi),
            new Web3Contract<PresaleServiceDeployerAbiFunctional>(toolkit, PresaleServiceDeployerAbi),
            new Web3Contract<TreasuryAbiFunctional>(toolkit, TreasuryAbi),
            new Web3Contract<TreasuryPocketAbiFunctional>(toolkit, TreasuryPocketAbi),
            new Web3Contract<TreasuryDeployerAbiFunctional>(toolkit, TreasuryDeployerAbi),
            new Web3Contract<VestingAbiFunctional>(toolkit, VestingAbi),
            new Web3Contract<VestingDeployerAbiFunctional>(toolkit, VestingDeployerAbi),
        );
    }
}
