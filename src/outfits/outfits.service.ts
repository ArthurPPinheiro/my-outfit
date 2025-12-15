import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { UpdateOutfitDto } from './dto/update-outfit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Season } from '@prisma/client';

@Injectable()
export class OutfitsService {
  constructor(private prisma: PrismaService) {}

  async create(createOutfitDto: CreateOutfitDto) {
    try {

      const { userId, clothes, ...outfitData } = createOutfitDto;

      return this.prisma.outfit.create({
        data: {
          ...outfitData,
          user: { connect: { id: userId } },
          season: createOutfitDto.season as Season,
          ...(clothes && {
            clothes: {
              create: clothes
            }
          })
        },
        include: {
          clothes: true
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.prisma.outfit.findMany();
  }

  async findOne(id: string) {
    try {
      const outfit = await this.prisma.outfit.findUnique({
        where: { id: id },
      });

      if (!outfit) {
        throw new NotFoundException('Outfit not found');
      }

      return outfit;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByUserId(userId: string) {
    try {
      return await this.prisma.outfit.findMany({
        where: { userId: userId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getItemsInOutfit(outfitId: string) {
    try {
      const outfitWithItems = await this.prisma.outfit.findUnique({
        where: { id: outfitId },
        include: { outfitItems: true },
      });

      if (!outfitWithItems) {
        throw new NotFoundException('Outfit not found');
      }

      return outfitWithItems.outfitItems;
      
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, data: UpdateOutfitDto) {
    try {
      const formattedData = {
        ...data,
        userId: data.userId,
        season: data.season as Season,
      };

      return await this.prisma.outfit.update({
        where: { id: id },
        data: {
          ...formattedData,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Outfit not found');
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.outfit.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
