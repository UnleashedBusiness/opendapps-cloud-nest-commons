import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import IndexingBlockEntity from './entity/indexing-block.entity.js';
import IndexingService from './indexing.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([IndexingBlockEntity]),
    ],
    controllers: [],
    providers: [IndexingService],
    exports: [IndexingService],
})
export default class IndexingModule {
}
