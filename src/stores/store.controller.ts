import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { CreateStoreDTO } from './dto/createStore.dto';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {

  constructor(private storeService: StoreService){}

  @Post('/createStore')
  createStore(@Body() body: CreateStoreDTO){
    return this.storeService.createStore(body);
  }

  @Get('/listAll')
  listAll(@Query('limit') limit: number, @Query('offset') offset: number){

    console.log("Limit: ", limit);
    console.log('offeset: ', offset);

    return this.storeService.listAll(limit, offset);
  } // retorne as stores da base, response 1;

  @Get('/storeByCep/:cep')
  storeByCep(@Param('cep') cep: string, @Query('type') type: string){
  
     return this.storeService.storeByCep(cep, type);

  } //retorna stores que sejam próximos ou PDV, response 2;

  
 storeById(){

 } // retorne store específico por id, response 1;
 storeByState(){

 } 

}
