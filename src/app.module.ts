import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreModule } from './stores/store.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({

  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), // Variáveis de ambiente globais
    MongooseModule.forRoot(process.env.MONGO_URI || '')
   , // Conexão MongoDB
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
