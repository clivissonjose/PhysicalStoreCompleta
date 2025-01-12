import { Injectable } from "@nestjs/common";

@Injectable()
export class FormatSores{

 formatStore(store: any, distance: number, frete?: any) {
    if ( distance <= 50 ) {
      return {
        name: store.storeName,
        city: store.city,
        postalCode: store.postalCode,
        type: store.type,
        distance: `${distance.toFixed(1)} km`,
        value: [
          {
            prazo: '1 dias úteis',
            price: 'R$ 15,00',
            description: 'Motoboy',
          },
        ],
      };
    }
  
    // Stores estarão com distancia > 50 e do tipo loja
    if (store.type === 'LOJA') {
      return {
        name: store.storeName,
        city: store.city,
        postalCode: store.postalCode,
        type: store.type,
        distance: `${distance.toFixed(1)} km`,
        value: [
          {
            prazo: frete[0].prazo,
            price: frete[0].precoAgencia,
            description: frete[0].url,
          },
          {
            prazo: frete[1].prazo,
            price: frete[1].precoAgencia,
            description: frete[1].urlTitulo,
          },
        ],
      };
    }
  
    return null;
  }
}