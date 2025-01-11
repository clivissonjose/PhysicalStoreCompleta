import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { CreateStoreDTO } from './dto/createStore.dto';
import { StoreService } from './store.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody} from '@nestjs/swagger';


@ApiTags('store')
@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @ApiOperation({ summary: 'Criar uma Loja ou PDV' }) // Descrição da operação
  @ApiBody({ description: 'Dados necessários para criar uma loja ou PDV',type: CreateStoreDTO,})
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
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    return this.storeService.storeByCep(cep, parseInt(limit), parseInt(offset));
  } //retorna stores que sejam próximos ou PDV, response 2;

  @Get('/:id')
  storeById(@Param('id') id: string) {
    return this.storeService.storeById(id);
  } // retorne store específico por id, response 1;


  @Get('/:uf')
  storeByState(@Param('uf') uf: string, @Query('limit') limit: string, @Query('offset') offset: string) {
    return this.storeService.storeByState(uf, parseInt(limit), parseInt(offset));
  }

}
