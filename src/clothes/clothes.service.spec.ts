import { Test, TestingModule } from '@nestjs/testing';
import { ClothesService } from './clothes.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ClothesService', () => {
  let service: ClothesService;
  let prismaService: PrismaService;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClothesService],
    }).compile();

    service = module.get<ClothesService>(ClothesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new clothing item', async () => {
          console.log('Test for creating a clothing item')
    });

    it('should retrieve all clothing items', async () => {
      console.log('Test for creating a clothing item')
    });

    it('should retrieve a clothing item by id', async () => {
      console.log('Test for creating a clothing item')
    });

    it('should update a clothing item', async () => {
      console.log('Test for creating a clothing item')
    });

    it('should delete a clothing item', async () => {
      console.log('Test for creating a clothing item')
    });
  });
});
