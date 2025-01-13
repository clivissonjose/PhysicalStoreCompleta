import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './store.schema';
import { CalculateCoordinates } from './services/calculate-coordenates';
import { CalculateFrete } from './services/calculate-frete';
import { CalculateDistances } from './services/calculate-distances';
import { FormatSores } from './services/format-store';
import { Document } from 'mongoose';


const mockStoreModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockCalculateCoordinates = {
  searchCoordinates: jest.fn(),
};

const mockCalculateFrete = {
  calcularFrete: jest.fn(),
};

const mockCalculateDistances = {
  calculateDistances: jest.fn(),
};

const mockFormatStores = {
  formatStore: jest.fn(),
};

describe('StoreService', () => {
  
  let service: StoreService;
  let storeModel: Model<Store>;
  let formatStores: jest.Mock;

  beforeEach(async () => {
    formatStores = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        formatStores,
        {
          provide: getModelToken('Store'),
          useValue: mockStoreModel,
        },
        {
          provide: CalculateCoordinates,
          useValue: mockCalculateCoordinates,
        },
        {
          provide: CalculateFrete,
          useValue: mockCalculateFrete,
        },
        {
          provide: CalculateDistances,
          useValue: mockCalculateDistances,
        },
        {
          provide: FormatSores,
          useValue: mockFormatStores,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    storeModel = module.get<Model<Store>>(getModelToken('Store'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
