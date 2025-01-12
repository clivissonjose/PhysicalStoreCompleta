import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { getModelToken } from '@nestjs/mongoose';
import { CalculateCoordinates } from './services/calculate-coordenates';
import { CalculateFrete } from './services/calculate-frete';
import { CalculateDistances } from './services/calculate-distances';
import { FormatSores } from './services/format-store';

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

describe('StoreController', () => {
  let controller: StoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        StoreService,
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

    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Adicione testes adicionais para o controlador aqui

});
