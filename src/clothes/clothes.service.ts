import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category, Season } from '@prisma/client';
import { use } from 'passport';
import { connect } from 'http2';

@Injectable()
export class ClothesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClothingDto) {
    try {
      return await this.prisma.clothingItem.create({
        data: {
          user: { connect: { id: data.userId } },
          name: data.name,
          category: data.category as Category,
          subcategory: data.subcategory,
          brand: data.brand,
          color: data.color,
          colors: { set: data.colors },
          size: data.size,
          season: data.season as Season,
          material: data.material,
          purchaseDate: data.purchaseDate,
          purchasePrice: data.purchasePrice,
          imageUrl: data.imageUrl,
          thumbnailUrl: data.thumbnailUrl,
          description: data.description,
          tags: { set: data.tags },
          isFavorite: data.isFavorite,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.prisma.clothingItem.findMany();
  }

  async findOne(id: string) {
    try{
      const clothing = await this.prisma.clothingItem.findUnique({
        where: { id: id },
      });

      if(!clothing){
        throw new NotFoundException("Clothing item not found");
      }
      
      return clothing;
    } catch(error){
      throw new NotFoundException(error.message);
    }
  }

  async findByUserId(userId: string) {
    try{
      return await this.prisma.clothingItem.findMany({
        where: { userId: userId },
      });
    } catch(error){
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, data: UpdateClothingDto) {
    try{
      const formattedData = {
        ...data,
        userId: data.userId,
        category: data.category as Category,
        season: data.season as Season,
      }

      return await this.prisma.clothingItem.update({
        where: { id: id },
        data: {
          ...formattedData,
          updatedAt: new Date()
        },
      });
    } catch(error){
      if (error.code === 'P2025') {
        throw new NotFoundException("Clothing item not found");
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try{
      return await this.prisma.clothingItem.delete({
        where: { id: id },
      });
    } catch(error){
      throw new InternalServerErrorException(error.message);
    }
  }
}
