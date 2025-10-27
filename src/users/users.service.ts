import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      const passwordHash = await bcrypt.hash(data.password, 10);

      return await this.prisma.user.create({
        data: {
          email : data.email,
          username : data.username,
          passwordHash : passwordHash,
          fullName : data.fullName,
          avatarUrl : data.avatarUrl
        }
      });
    } catch (error) {
     if (error.code === 'P2002') {
        throw new ConflictException('Email or username already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    try{

      const user = await this.prisma.user.findUnique({ 
        where: { id: id }
      });

      if(!user){
        throw new NotFoundException("User not found");
      }

      return user;
    } catch (error) {
      throw new NotFoundException("User not found");
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try{

      return await this.prisma.user.update({
        where: { id: id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException("User not found");
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updatePassword(id: string, password: string) {
    try{
      const passwordHash = await bcrypt.hash(password, 10);
      return await this.prisma.user.update({
        where: { id: id },
        data: {
          passwordHash: passwordHash,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException("User not found");
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try{
      return await this.prisma.user.delete({
        where: { id: id }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException("User not found");
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}