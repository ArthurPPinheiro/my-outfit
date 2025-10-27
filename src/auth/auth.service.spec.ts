import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockLoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw NotFoundException if user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(mockLoginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = { id: 'user-id', email: mockLoginDto.email, passwordHash: 'hashedPassword' };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return a valid access token if user credentials are correct', async() => {
      const mockUser = { id: 'user-id', email: mockLoginDto.email, passwordHash: 'hashedPassword' };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('validAccessToken');
      
      const result = await authService.login(mockLoginDto);

      expect(result).toEqual({ accessToken: 'validAccessToken' });
    })

  });
});