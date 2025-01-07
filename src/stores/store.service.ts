import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './store.schema';
import { CreateStoreDTO } from './dto/createStore.dto';
import axios from 'axios';
import * as soap from 'soap';

@Injectable()
export class StoreService {
  constructor(@InjectModel('Store') private storeModel: Model<Store> ){}

 async createStore(createStoreDto: CreateStoreDTO, cep: string){

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
          throw new Error("CEP não encontrado");
      }

      const coordinates = this.searchCoordinates(cep);
      // Retorna o endereço completo
      createStoreDto.address1 = data.logradouro
      createStoreDto.city = data.localidade
      createStoreDto.district = data.bairro
      createStoreDto.state = data.uf
      createStoreDto.latitude = (await coordinates).latitude
      createStoreDto.longitude = (await coordinates).longitude
    const createdStore = new this.storeModel(createStoreDto);

    return createdStore.save();
  }

  async  listAll(limit: number, offset: number){

     const stores = await this.storeModel.find().skip(offset).limit(limit);
     const total = stores.length;

     return {
      stores,
      limit,
      offset,
      total,
     }

  } // retorne as stores da base, response 1;


 
  async storeByCep(cep: string, type: string, limit: number, offset: number){
    
    const stores = await this.storeModel.find()
    
    const coordinates = await this.searchCoordinates(cep);
    
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
    );
    

    // Se não tiver o tipo especifico de loja, será mostrado todas as lojas
   
    if(!type){
       
       return {
        stores: storesWithDistance,
        limit,
        offset,
        total:stores.length
       }
    }


    if(type === 'PDV'){
      const storesPDV  = storesWithDistance.filter((store) => {
        return store.type === 'PDV' && store.distance <= 50
      }).map((store) => ({
        name: store.storeName,
        city: store.city,
        postalCode: store.postalCode,
        type: store.type,
        distance:  `${store.distance.toFixed(1)}`, // Distância formatada
        value: [
          {
            prazo: "1 dias úteis",
            price: "R$ 15,00",
            description: "Motoboy",
          },
        ],
      }))

      storesPDV.sort((a,b) => parseInt(a.distance) - parseInt(b.distance));
      return{
         stores: storesPDV, 
         limit,
         offset,
         total: storesPDV.length,
      }
    }

    if(type === 'LOJA'){
      const storesLOJA = await Promise.all(storesWithDistance.filter((store)=>
        store.type === 'LOJA')
        .map( async (store) => {
  
        return {
          name: store.storeName,
          city: store.city,
          postalCode: store.postalCode,
          type: store.type,
          distance:  `${store.distance.toFixed(1)}`, // Distância formatada
          value: [
          
              {
                 prazo: 736,
                 codProdutoAgencia: "04014",
                 price: "R$ 27,00",
                 description: "Sedex a encomenda expressa dos Correios"
     
              },
              {
                  "prazo": "6 dias úteis",
                  "codProdutoAgencia": "04510",
                  "price": "R$ 25,50",
                  "description": "PAC a encomenda economica dos Correios"
              }
          
          ]
        }
      }))

      return{
        stores: storesLOJA,
        limit,
        offset,
        total: storesLOJA.length
      }
    }
  } //retorna stores que sejam próximos ou PDV, response 2;


 storeById(id: any){
   const storeById =  this.storeModel.findById(id);

   return storeById;
 } // retorne store específico por id, response 1;
 
 async storeByState(uf:string, limit: number, offset: number){
      //console.log("Limit: ", parseInt(limit), "offset", offset)

      const stores = await this.storeModel.aggregate([

        {
          $group: {
            _id: "$state", // Agrupa por estado
            stores: { $push: "$$ROOT" }, // Adiciona todas as lojas do grupo
            totalStores: { $sum: 1 }, // Conta o número de lojas em cada estado
          },
        },
        {
          $sort: { _id: 1 }, // Ordena em ordem alfabeica
        },
        {
          $skip: offset, // Pula o número de documentos especificado no offset
        },
        {
          $limit: limit, // Limita o número de documentos retornados
        },
        {
          $project: {
            _id: 0, // Remove o campo `_id` do resultado
            state: "$_id", // Renomeia `_id` para `state`
            stores: 1, // Inclui as lojas no resultado
            totalStores: 1, // Inclui a contagem total de lojas no resultado
          },
        },
      ]);
    
      return {
        stores,
        limit,
        offset,
        total: stores.length
      };
 }

 private radianos(graus:number){
  return graus * (Math.PI / 180);
 }

 private async calculateDistances(lat: number, log: number, latStore: number, logStore: number){
    

  const R = 6371; // Raio da Terra em km

  // Diferenças entre as latitudes de longitudes
  const dLat = this.radianos(latStore - lat);
  const dLon = this.radianos(logStore - log);

  // Fórmula de harvesine para  calcular distancias
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + // Componente de latitude
    Math.cos(this.radianos(lat)) * Math.cos(this.radianos(latStore)) * // Ajuste para diferenças de longitude e latitude
    Math.sin(dLon / 2) * Math.sin(dLon / 2); // Componente de longitude

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = R * c; // Resultado em quilômetros
  return distancia;
 }

 private async searchCoordinates(cep : string){

  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: `${cep}, Brazil`,
      key: 'AIzaSyCkgYheq_hsuBgi2RISBZHprvquFiwe9pk',
      // parâmetro aleatório para evitar o cache
      random: Math.random()
    }
  });

  const data = response.data;

  // Verificar se tudo está ok
  if (data.status !== "OK" || data.results.length === 0) {
    console.error("CEP não encontrado ou erro na requisição:", data.status);
    return null;
  }

  return {
    latitude: data.results[0].geometry.location.lat,
    longitude: data.results[0].geometry.location.lng
  };
 }


}
