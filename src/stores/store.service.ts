import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './store.schema';
import { CreateStoreDTO } from './dto/createStore.dto';
import { CalculateCoordinates } from 'src/stores/services/calculate-coordenates';
import { CalculateFrete } from 'src/stores/services/calculate-frete';
import { CalculateDistances } from 'src/stores/services/calculate-distances';
import { Types } from 'mongoose';


@Injectable()
export class StoreService {
  constructor(
    @InjectModel('Store') private storeModel: Model<Store>,
    private calculateCoordinates: CalculateCoordinates,
    private calculateFrete: CalculateFrete,
    private calculateDistances: CalculateDistances,
  ) {}

  async createStore(createStoreDto: CreateStoreDTO, cep: string) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    const coordinates = this.calculateCoordinates.searchCoordinates(cep);
    // Retorna o endereço completo
    createStoreDto.storeName = 'Renner';
    createStoreDto.address1 = data.logradouro;
    createStoreDto.city = data.localidade;
    createStoreDto.district = data.bairro;
    createStoreDto.state = data.uf;
    createStoreDto.latitude = (await coordinates).latitude;
    createStoreDto.longitude = (await coordinates).longitude;
    const createdStore = new this.storeModel(createStoreDto);

    return createdStore.save();
  }

  async listAll(limit: number, offset: number) {
    const stores = await this.storeModel.find().skip(offset).limit(limit);

    const total = stores.length;

    return {
      stores,
      limit,
      offset,
      total,
    };
  } // retorne as stores da base, response 1;

  async storeByCep(cep: string, limit: number, offset: number) {
    const stores = await this.storeModel.find();

    const coordinates = await this.calculateCoordinates.searchCoordinates(cep);

    // Calcular distâncias
    const storesWithDistance = await Promise.all(
      stores.map(async (store) => {
        const distance = await this.calculateDistances.calculateDistances(
          parseFloat(coordinates.latitude),
          parseFloat(coordinates.longitude),
          parseFloat(store.latitude),
          parseFloat(store.longitude),
        );
        return { ...store.toObject(), distance };
      }),
    );

    const sortedStores = storesWithDistance.sort(
      (a, b) => a.distance - b.distance,
    );

    const storesPDV = sortedStores
      .filter((store) => store.type === 'PDV' && store.distance <= 50)
      .map((store) => ({
        name: store.storeName,
        city: store.city,
        postalCode: store.postalCode,
        type: store.type,
        distance: `${store.distance.toFixed(1)} km`,
        value: [
          {
            prazo: '1 dias úteis',
            price: 'R$ 15,00',
            description: 'Motoboy',
          },
        ],
      }));

    
    const storesLOJA = await Promise.all(
      sortedStores
        .filter((store) => store.type === 'LOJA')
        .map(async (store) => {
          
          if (store.distance > 50) {

            const cepDestinoLimpo = store.postalCode.replace('-', '');
            const frete = await this.calculateFrete.calcularFrete(cep, cepDestinoLimpo);

            return {
              name: store.storeName,
              city: store.city,
              postalCode: store.postalCode,
              type: store.type,
              distance: `${store.distance.toFixed(1)} km`,
              value: [
                {
                  prazo: frete[0].prazo,
                  codProdutoAgencia: frete[0].codProdutoAgencia,
                  price: frete[0].precoAgencia,
                  description: 'Sedex a encomenda expressa dos Correios',
                },
                {
                  prazo: frete[1].prazo,
                  codProdutoAgencia: frete[1].codProdutoAgencia,
                  price: frete[1].precoAgencia,
                  description: 'PAC a encomenda econômica dos Correios',
                },
              ],
            };
          } else {
            return {
              name: store.storeName,
              city: store.city,
              postalCode: store.postalCode,
              type: store.type,
              distance: `${store.distance.toFixed(1)} km`,
              value: [
                {
                  prazo: '1 dias úteis',
                  price: 'R$ 15,00',
                  description: 'Motoboy',
                },
              ],
            };
          }
        }),
    );

    const allStores = [...storesPDV, ...storesLOJA];
  
    allStores.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    const paginatedStores = allStores.slice(offset, offset + limit);

    return {
      stores: paginatedStores,
      pins: {
        position: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        },
        title: "Renner"
      },
      limit,
      offset,
      total: paginatedStores.length,
    };
    
  } //retorna stores que sejam próximos ou PDV, response 2;

  async storeById(id: any) {
    
      // Conversão para ObjectId e busca no banco

      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const store = await this.storeModel.findOne({ _id: new Types.ObjectId(id) })
      if (!store) {
        throw new Error(`Store with ID ${id} not found`);
      }
  
      return {
        store,
        limit: 1,
        offset: 0,
        total: 1,
      };
   
  } // retorne store específico por id, response 1;

  async storeByState(uf: string, limit: number, offset: number) {
    
    const stores = await this.storeModel.find({state: uf}).limit(limit).skip(offset);;

    
    return {
      stores,
      limit,
      offset,
      total: stores.length,
    };
  }
}
