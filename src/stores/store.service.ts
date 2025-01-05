import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './store.schema';
import { CreateStoreDTO } from './dto/createStore.dto';

@Injectable()
export class StoreService {
  constructor(@InjectModel('Store') private storeModel: Model<Store> ){}

  createStore(createStoreDto: CreateStoreDTO){
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


  //TODO: colocar o limit e o offset,além das funcões de distâncias
  async storeByCep(cep: string, type: string){

    const stores = await this.storeModel.find();
    
    if(!type){
       
       return {
        stores,
        total:stores.length
       }
    }


    if(type === 'PDV'){
      const storesPDV  = stores.filter((store) => {
        return store.type === 'PDV'
      })

      return{
        stores: storesPDV,
        total: storesPDV.length
      }
    }

    if(type === 'LOJA'){
      const storesLOJA = stores.filter((store)=>{
        return store.type === 'LOJA'
      })

      return{
        stores: storesLOJA,
        total: storesLOJA.length
      }
    }
  } //retorna stores que sejam próximos ou PDV, response 2;


 storeById(){
  
 } // retorne store específico por id, response 1;
 storeByState(){

 } // retorne stores por estado, response 1
}
