import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { CreateStoreDTO } from './dto/createStore.dto';
import { StoreService } from './store.service';
import { ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';


@ApiTags('store')
@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @ApiOperation({ summary: 'Criar uma Loja ou PDV' }) // Descrição da operação
  @Post('/createStore')
  createStore(@Body() body: CreateStoreDTO) {
    return this.storeService.createStore(body, body.postalCode);
  }

  @ApiResponse({ status: 200, description: 'Lojas retornadas com sucesso.' })
  @Get('/listAll')
  listAll(@Query('limit') limit: string, @Query('offset') offset: string) {
    return this.storeService.listAll(parseInt(limit), parseInt(offset));
  } // retorne as stores da base, response 1;

  @Get('/storeByCep/:cep')
  storeByCep(
    @Param('cep') cep: string,
    @Query('type') type: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    return this.storeService.storeByCep(cep, type, parseInt(limit), parseInt(offset));
  } //retorna stores que sejam próximos ou PDV, response 2;

  @Get('/id')
  storeById(@Query('id') id: string) {
    return this.storeService.storeById(id);
  } // retorne store específico por id, response 1;

  @Get('/storeByState')
  storeByState(@Query('limit') limit: string, @Query('offset') offset: string) {
    return this.storeService.storeByState(parseInt(limit), parseInt(offset));
  }

}
