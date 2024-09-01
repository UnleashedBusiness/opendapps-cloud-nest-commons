import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import IndexingBlockEntity from "./entity/indexing-block.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {BigNumber} from "bignumber.js";
import CurrentBlockDto from "./dto/current-block.dto.js";

@Injectable()
export default class IndexingService {
    constructor(
        @InjectRepository(IndexingBlockEntity)
        private readonly repository: Repository<IndexingBlockEntity>
    ) {
    }

    public async setIndexingHeight(chainId: number, query: string, height: BigNumber): Promise<void> {
        await this.repository.upsert({
            block: height,
            query: query,
            chainId: chainId,
        }, ['chainId', 'query']);
    }

    public async getCurrentBlock(chainId: number, query:string): Promise<CurrentBlockDto | undefined> {
        const x = await this.repository.findOne({
            where: {
                chainId: chainId,
                query: query,
            }
        });
        if (x === null) {
            return undefined;
        }

        return {
            block: x.block.toFixed(),
        };
    }
}
