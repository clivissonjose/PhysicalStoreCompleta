import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store, StoreSchema } from './store.schema'; 


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),  // Use 'Store' como string diretamente
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}