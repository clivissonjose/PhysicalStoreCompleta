import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './store.schema';
import { CreateStoreDTO } from './dto/createStore.dto';
import axios from 'axios';

@Injectable()
export class StoreService {
  constructor(@InjectModel('Store') private storeModel: Model<Store>) {}

  async createStore(createStoreDto: CreateStoreDTO, cep: string) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    const coordinates = this.searchCoordinates(cep);
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
    const stores = await this.storeModel.find().limit(limit).skip(offset)
  
    const total = stores.length;

    return {
      stores,
      limit,
      offset,
      total,
    };
  } // retorne as stores da base, response 1;

  async storeByCep(cep: string, type: string, limit: number, offset: number) {
    
    const stores = await this.storeModel.find();

    const coordinates = await this.searchCoordinates(cep);

    // Calcular distâncias
    const storesWithDistance = await Promise.all(
        stores.map(async (store) => {
            const distance = await this.calculateDistances(
                parseFloat(coordinates.latitude),
                parseFloat(coordinates.longitude),
                parseFloat(store.latitude),
                parseFloat(store.longitude),
            );
            return { ...store.toObject(), distance };
        }),
      )

      const sortedStores = storesWithDistance.sort((a, b) => a.distance - b.distance);


    // Se não tiver o tipo da loja, será mostrado todas as stores (PDV OU LOJA)

    if (!type) {
      const paginatedStores = sortedStores.slice(offset, offset + limit);
      return {
        stores: paginatedStores,
        limit,
        offset,
        total: paginatedStores.length,
      };
    }

    if (type === 'PDV') {
      const storesPDV = storesWithDistance
        .filter((store) => 
           store.type === 'PDV' && store.distance <= 50
        )
        .map((store) => ({
          name: store.storeName,
          city: store.city,
          postalCode: store.postalCode,
          type: store.type,
          distance: `${store.distance.toFixed(1)} km`, // Distância formatada

          value: [
            {
              prazo: '1 dias úteis',
              price: 'R$ 15,00',
              description: 'Motoboy',
            },
          ],
        }));

      return {
        stores: storesPDV.slice(offset, offset+limit),
        limit,
        offset,
        total: storesPDV.length,
      };
    }

    if (type === 'LOJA') {
      const storesLOJA = await Promise.all(
        storesWithDistance
          .filter((store) => store.type === 'LOJA')
          .map(async (store) => {
            const cepDestinoLimpo = store.postalCode.replace('-', '');

            const frete = await this.calcularFrete(cep, cepDestinoLimpo);

            if (store.distance > 50) {
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
                    description: 'PAC a encomenda economica dos Correios',
                  },
                ],
              };
            } else {
              return {
                name: store.storeName,
                city: store.city,
                postalCode: store.postalCode,
                type: store.type,
                distance: `${store.distance.toFixed(1)} km`, // Distância formatada

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

      
      return {
        stores: storesLOJA.slice(offset, offset+limit),
        limit,
        offset,
        total: storesLOJA.length,
      };
    }
  } //retorna stores que sejam próximos ou PDV, response 2;

  storeById(id: any) {
    const stores = this.storeModel.findById(id);

    return stores;
  } // retorne store específico por id, response 1;

  async storeByState(limit: number, offset: number) {
    //console.log("Limit: ", parseInt(limit), "offset", offset)

    const stores = await this.storeModel.aggregate([
      {
        $group: {
          _id: '$state', // Agrupa por estado
          stores: { $push: '$$ROOT' }, // Adiciona todas as lojas do grupo
          totalStores: { $sum: 1 }, // Conta o número de lojas em cada estado
        },
      },
      {
        $sort: { _id: 1 }, // Ordena em ordem alfabeica
      },
      {
        $skip: offset, // Pula o número de lojas
      },
      {
        $limit: limit, // Limita o número de lojas que será retornado
      },
      {
        $project: {
          _id: 0, // Remove o campo `_id` do resultado
          state: '$_id', // Renomeia `_id` para `state`
          stores: 1, // Inclui as lojas no resultado
          totalStores: 1, // Inclui a contagem total de lojas no resultado
        },
      },
    ]);

    return {
      stores,
      limit,
      offset,
      total: stores.length,
    };
  }

  // Funções auxiliares

  // Funcao para calcular distancia entre duas localidades
  private radianos(graus: number) {
    return graus * (Math.PI / 180);
  }

   async calculateDistances(
    lat: number,
    log: number,
    latStore: number,
    logStore: number,
  ) {
    const R = 6371; // Raio da Terra em km

    // Diferenças entre as latitudes de longitudes
    const dLat = this.radianos(latStore - lat);
    const dLon = this.radianos(logStore - log);

    // Fórmula de harvesine para  calcular distancias
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.radianos(lat)) *
        Math.cos(this.radianos(latStore)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = R * c; // Resultado em qquilometros
    return distancia;
  }

  // Funcao para encontrar coordenadas
   async searchCoordinates(cep: string) {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: `${cep}, Brazil`,
          key: 'AIzaSyCkgYheq_hsuBgi2RISBZHprvquFiwe9pk',

          random: Math.random(),
        },
      },
    );

    const data = response.data;

    // Verificar se tudo está ok
    if (data.status !== 'OK' || data.results.length === 0) {
      console.error('CEP não encontrado ou erro na requisição:', data.status);
      return null;
    }

    return {
      latitude: data.results[0].geometry.location.lat,
      longitude: data.results[0].geometry.location.lng,
    };
  }

   async calcularFrete(cepOrigem: string, cepDestino: string) {
    let data = JSON.stringify({
      cepOrigem,
      cepDestino,
      comprimento: '20',
      largura: '15',
      altura: '10',
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://www.correios.com.br/@@precosEPrazosView',
      headers: {
        'Content-Type': 'application/json',
        Cookie:
          'LBprdExt2=852033546.47873.0000; LBprdint2=3074031626.47873.0000; TS01a7fccb=01ff9e5fc64fd38a5b2e50a2ae3a570ef11d7b9449096c5247fb9319b4c45f9e32e3efda46b82068af62752a57017007cc253c024822dff0b9b9460ba987098591ab9710f6df38a05c6b4bfe42834161daf1fad8d3',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Erro ao calcular o frete:', error.message);
      throw new Error('Erro ao calcular o frete');
    }
  }


}
