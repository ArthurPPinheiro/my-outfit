import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

describe('UserService', () => {
    let userService: UsersService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            create: jest.fn(),
                            findUnique: jest.fn(),
                            findMany: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn()
                        }
                    }
                }
            ],
        }).compile();

        userService = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        const mockCreateUserDto = {
            email: 'email@email.com',
            username: 'username',
            password: 'password',
            fullName: 'Full Name',
            avatarUrl: 'http://avatar.url/image.png'
        };

        it('should create a new user', async () => {
            const mockCreatedUser = {
                id: 'user-id',
                email: mockCreateUserDto.email,
                username: mockCreateUserDto.username,
                fullName: mockCreateUserDto.fullName,
                avatarUrl: mockCreateUserDto.avatarUrl
            };

            (prismaService.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

            const result = await userService.create(mockCreateUserDto);

            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    email: mockCreateUserDto.email,
                    username: mockCreateUserDto.username,
                    fullName: mockCreateUserDto.fullName,
                    avatarUrl: mockCreateUserDto.avatarUrl
                })
            });
            expect(result).toEqual(mockCreatedUser);
        });

        it('should throw ConflictException if email or username already exists', async () => {
            (prismaService.user.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

            await expect(userService.create(mockCreateUserDto)).rejects.toThrow('Email or username already exists');
        });

    });

    describe('findOne', () => {
        it('should return a user by id', () => {
            const mockUser = {
                id: 'user-id',
                email: 'email@email.com',
            };
            (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            const result = userService.findOne('user-id');

            expect(result).resolves.toEqual(mockUser);
        })

        it('should throw NotFoundException if user not found', async () => {
            (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

            const result = userService.findOne('invalid-id');

            expect(result).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update and return the user', async () => {
            const mockUpdatedUser = {
                id: 'user-id',
                fullName: 'Updated Name'
            };

            (prismaService.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

            const result = await userService.update('user-id', { fullName: 'Updated Name' });

            expect(result).toEqual(mockUpdatedUser);
        });

        it('should throw NotFoundException if user to update does not exist', async () => {
            (prismaService.user.update as jest.Mock).mockRejectedValue({ code: 'P2025' });

            await expect(userService.update('invalid-id', { fullName: 'Name' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            const mockUser = { id: 'user-id' };
            (prismaService.user.delete as jest.Mock).mockResolvedValue('user-id');

            const result = await userService.remove('user-id');
            expect(result).toEqual(mockUser.id);
        });

        it('should throw NotFoundException if user to delete does not exist', async () => {
            (prismaService.user.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });

            await expect(userService.remove('invalid-id')).rejects.toThrow(NotFoundException);
        });
    });
});