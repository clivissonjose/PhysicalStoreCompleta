import { FormatSores } from "./services/format-store";

describe('FormatStores', () => {
  let formatStores: FormatSores;

  beforeEach(() => {
    formatStores = new FormatSores();
  });


  // 5 - PDV; Considerar +50km e -50km
  it('should format store with distance ≤ 50 km and NULL with distance > 50 (PDV)', () => {
    const storePDV = { storeName: 'Test Store', city: 'Test City', postalCode: '12345', type: 'PDV' };
    const result = formatStores.formatStore(storePDV, 30);

    expect(result).toEqual({
      name: 'Test Store',
      city: 'Test City',
      postalCode: '12345',
      type: 'PDV',
      distance: '30.0 km',
      value: [
        {
          prazo: '1 dias úteis',
          price: 'R$ 15,00',
          description: 'Motoboy',
        },
      ],
    });

    const store = { storeName: 'Test Store', city: 'Test City', postalCode: '12345', type: 'PDV' };
    const result2 = formatStores.formatStore(store, 100);

    expect(result2).toBeNull();

  });

  // 4 - LOJA; Considerar: +50km e -50km

  it('should format store with distance > 50 km (LOJA) and store with distance <= 50', () => {
    const storeLojaPlus50 = { storeName: 'Test Store', city: 'Test City', postalCode: '12345', type: 'LOJA' };
    const frete = [
      { prazo: '2 dias úteis', precoAgencia: 'R$ 27,00', url: 'Sedex URL' },
      { prazo: '6 dias úteis', precoAgencia: 'R$ 25,50', urlTitulo: 'PAC URL' },
    ];
    const result = formatStores.formatStore(storeLojaPlus50, 100, frete);

    expect(result).toEqual({
      name: 'Test Store',
      city: 'Test City',
      postalCode: '12345',
      type: 'LOJA',
      distance: '100.0 km',
      value: [
        {
          prazo: '2 dias úteis',
          price: 'R$ 27,00',
          description: 'Sedex URL',
        },
        {
          prazo: '6 dias úteis',
          price: 'R$ 25,50',
          description: 'PAC URL',
        },
      ],
    });

    const storeLojaLess50 = { storeName: 'Test Store', city: 'Test City', postalCode: '12345', type: 'LOJA' };
    const result1 = formatStores.formatStore(storeLojaLess50, 30);

    expect(result1).toEqual({
      name: 'Test Store',
      city: 'Test City',
      postalCode: '12345',
      type: 'LOJA',
      distance: '30.0 km',
      value: [
        {
          prazo: '1 dias úteis',
          price: 'R$ 15,00',
          description: 'Motoboy',
        },
      ],
    });

  });

 
});
