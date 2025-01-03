import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreService } from './stores/store.service';
import { StoreController } from './stores/store.controller';
import { StoreModule } from './stores/store.module';

@Module({
  imports: [StoreModule],
  controllers: [AppController, StoreController],
  providers: [AppService, StoreService],
})
export class AppModule {}
