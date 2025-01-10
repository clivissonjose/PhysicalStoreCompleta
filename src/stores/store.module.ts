import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store, StoreSchema } from './store.schema';

import { CalculateCoordinates } from 'src/stores/services/calculate-coordenates';
import { CalculateFrete } from 'src/stores/services/calculate-frete';
import { CalculateDistances } from 'src/stores/services/calculate-distances';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
  ],
  controllers: [StoreController],
  providers: [
    StoreService,
    CalculateDistances,
    CalculateFrete,
    CalculateCoordinates,
  ],
})
export class StoreModule {}
