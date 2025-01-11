import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { getModelToken } from '@nestjs/mongoose';
import { CalculateFrete } from './services/calculate-frete';
import { CalculateDistances } from './services/calculate-distances';
import { CalculateCoordinates } from 'src/stores/services/calculate-coordenates';

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreService,{
        provide: getModelToken('Store'), // Mock do Model do Mongoose
        useValue: {
          find: jest.fn(),
          findById: jest.fn(),
          save: jest.fn(),
        },
      },
      {
        provide: CalculateCoordinates,
        useValue: {
          searchCoordinates: jest.fn(),
        },
      },
      {
        provide: CalculateFrete,
        useValue: {
          calcularFrete: jest.fn(),
        },
      },
      {
        provide: CalculateDistances,
        useValue: {
          calculateDistances: jest.fn(),
        },
      }],
      
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
