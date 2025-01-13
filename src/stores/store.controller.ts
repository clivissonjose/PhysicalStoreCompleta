import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { CreateStoreDTO } from './dto/createStore.dto';
import { StoreService } from './store.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody} from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

@ApiTags('store')
@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @ApiOperation({ summary: 'Criar uma Loja ou PDV' }) // Descrição da operação
  @ApiBody({ description: 'Dados necessários para criar uma loja ou PDV',type: CreateStoreDTO,})
  @ApiResponse({ status: 201, description: 'Loja criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post('/createStore')
  createStore(@Body() body: CreateStoreDTO) {
    return this.storeService.createStore(body, body.postalCode);
  }

  @ApiOperation({ summary: 'Listar todas as lojas ou PDVs' })
  @ApiResponse({ status: 200, description: 'Lojas retornadas com sucesso.' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  @Get('/listAll')
  listAll(@Query('limit') limit: string, @Query('offset') offset: string) {
    return this.storeService.listAll(parseInt(limit), parseInt(offset));
  } // retorne as stores da base, response 1;


  @ApiOperation({ summary: 'Buscar lojas próximas por CEP' })
  @ApiResponse({ status: 200, description: 'Lojas retornadas com sucesso.' })
  @ApiResponse({ status: 400, description: 'CEP inválido.' })
  @Get('/storeByCep/:cep')
  async storeByCep(
    @Param('cep') cep: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    
    if (cep.length !== 8) {
      throw new BadRequestException('CEP inválido. O CEP deve conter exatamente 8 caracteres.');
    }

    try {
      return await this.storeService.storeByCep(cep, parseInt(limit), parseInt(offset));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar lojas por CEP. Detalhes: ' + error.message);
    }
   
  } //retorna stores que sejam próximos ou PDV, response 2;

  @ApiOperation({ summary: 'Buscar loja específica por ID' })
  @ApiResponse({ status: 200, description: 'Loja retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada.' })
  @Get('/:id')
  async storeById(@Param('id') id: string) {
    try {
      return await this.storeService.storeById(id);
    } catch (error) {
      throw new BadRequestException('Erro ao buscar loja por ID. Detalhes: ' + error.message);
    }
  } // retorne store específico por id, response 1;


  @ApiOperation({ summary: 'Buscar lojas por estado' })
  @ApiResponse({ status: 200, description: 'Lojas retornadas com sucesso.' })
  @ApiResponse({ status: 400, description: 'UF inválido.' })
  @Get('/storesByState/:uf')
  async storeByState(@Param('uf') uf: string, @Query('limit') limit: string, @Query('offset') offset: string) {
    
    try {
      return await this.storeService.storeByState(uf, parseInt(limit), parseInt(offset));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar lojas por estado. Detalhes: ' + error.message);
    }
  }

}
