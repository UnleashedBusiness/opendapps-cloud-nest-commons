import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import {BigNumber} from "bignumber.js";
import {BigintTransformer} from "../../utils/bigint.transformer.js";

@Entity({
  name: 'indexing_blocks',
})
export default class IndexingBlockEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  public id!: string;

  @Column({
    name: 'chain_id',
  })
  public chainId: number;

  @Column({
    name: "block",
    type: "bigint",
    transformer: BigintTransformer.instance
  })
  public block: BigNumber;

  @Column()
  public query: string;

  @CreateDateColumn({
    name: 'date_created',
  })
  public dateCreated!: Date;

  constructor(chainId: number, block: BigNumber, query: string) {
    this.chainId = chainId;
    this.block = block;
    this.query = query;
  }
}
