import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateIndexingBlocksTable1697308487489
  implements MigrationInterface
{
  public up(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.createTable(
      new Table({
        name: 'indexing_blocks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'date_created',
            type: 'timestamp without time zone',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'query',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'chain_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'block',
            type: 'bigint',
            isNullable: false,
          },
        ],
        uniques: [
          {
            columnNames: ['chain_id', 'query'],
          },
        ],
      }),
    );
  }

  public down(queryRunner: QueryRunner): Promise<any> {
    return queryRunner.dropTable('indexing_blocks');
  }
}
