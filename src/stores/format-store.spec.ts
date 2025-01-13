import { FormatSores } from "./services/format-store";

describe('FormatStores', () => {
  let formatStores: FormatSores;

  beforeEach(() => {
    formatStores = new FormatSores();
  });

  // 1 - PDV e LOJA; Considerar: +50km e -50km

  it('should return correct stores based on type and distance', async () => {
    
    const stores = [
      {
        _id: '1',
        storeName: 'PDV A',
        type: 'PDV',
        latitude: '-9.4059552',
        longitude: '-36.6298329',
        postalCode: '57600-025',
        city: 'Palmeira dos Índios',
      },
      {
        _id: '2',
        storeName: 'LOJA B',
        type: 'LOJA',
        latitude: '-10.000000',
        longitude: '-37.000000',
        postalCode: '57601-111',
        city: 'Maceió',
      },
    ];
    

    
    const mockDistances = [30, 60]; 
    const mockFrete = [
      { prazo: '2 dias úteis', precoAgencia: 'R$ 27,00', url: 'Sedex' },
      { prazo: '6 dias úteis', precoAgencia: 'R$ 25,50', urlTitulo: 'PAC' },
    ];

    
    const formattedStores = stores.map((store, index) =>
      formatStores.formatStore(store, mockDistances[index], store.type === 'LOJA' ? mockFrete : undefined),
    );

    expect(formattedStores[0]).toEqual({
      name: 'PDV A',
      city: 'Palmeira dos Índios', 
      postalCode: '57600-025',
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
    
    expect(formattedStores[1]).toEqual({
      name: 'LOJA B',
      city: 'Maceió', 
      postalCode: '57601-111',
      type: 'LOJA',
      distance: '60.0 km',
      value: [
        {
          prazo: '2 dias úteis',
          price: 'R$ 27,00',
          description: 'Sedex',
        },
        {
          prazo: '6 dias úteis',
          price: 'R$ 25,50',
          description: 'PAC',
        },
      ],
    });
    
  });
  // 2 - PDV -50KM E LOJA +50KM

  it('it should return the right format to PDV <= 50 and LOJA > 50',  () => {
   
  const stores = [
    {
      _id: '1',
      storeName: 'PDV A',
      type: 'PDV',
      latitude: '-9.4059552',
      longitude: '-36.6298329',
      postalCode: '57600-025',
      city: 'Palmeira dos Índios',
    },
    {
      _id: '2',
      storeName: 'LOJA B',
      type: 'LOJA',
      latitude: '-10.000000',
      longitude: '-37.000000',
      postalCode: '57601-111',
      city: 'Maceió',
    },
  ];


  const distances = [30, 60]; 

  
  const frete = [
    { prazo: '2 dias úteis', precoAgencia: 'R$ 27,00', url: 'Sedex' },
    { prazo: '6 dias úteis', precoAgencia: 'R$ 25,50', urlTitulo: 'PAC' },
  ];

  
  const formatSores = new FormatSores();

  const formattedPDV = formatSores.formatStore(stores[0], distances[0]); 
  const formattedLoja = formatSores.formatStore(stores[1], distances[1], frete); 

  
  expect(formattedPDV).toEqual({
    name: 'PDV A',
    city: 'Palmeira dos Índios',
    postalCode: '57600-025',
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

  expect(formattedLoja).toEqual({
    name: 'LOJA B',
    city: 'Maceió',
    postalCode: '57601-111',
    type: 'LOJA',
    distance: '60.0 km',
    value: [
      {
        prazo: '2 dias úteis',
        price: 'R$ 27,00',
        description: 'Sedex',
      },
      {
        prazo: '6 dias úteis',
        price: 'R$ 25,50',
        description: 'PAC',
      },
    ],
  });
  })



  // 5 - PDV; Considerar +50km e -50km
  it('should format store with distance <= 50 km and NULL with distance > 50 (PDV)', () => {
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
      { prazo: '2 dias úteis', precoAgencia: 'R$ 27,00', url: 'Sedex a encomenda expressa dos Correios' },
      { prazo: '6 dias úteis', precoAgencia: 'R$ 25,50', urlTitulo: 'PAC a encomenda economica dos Correios' },
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
          description: 'Sedex a encomenda expressa dos Correios',
        },
        {
          prazo: '6 dias úteis',
          price: 'R$ 25,50',
          description: 'PAC a encomenda economica dos Correios',
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
