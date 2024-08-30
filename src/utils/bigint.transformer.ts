import {BigNumber} from "bignumber.js";
import {bn_wrap} from "@unleashed-business/ts-web3-commons";
import {ValueTransformer} from "typeorm";

export class BigintTransformer implements ValueTransformer {
    public static readonly instance = new BigintTransformer();

    from(value: string | number | bigint): BigNumber {
        return bn_wrap(value);
    }

    to(value: BigNumber): string {
        return value.toFixed();
    }
}