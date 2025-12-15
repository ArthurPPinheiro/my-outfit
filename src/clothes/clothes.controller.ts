import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('clothes')
@UseGuards(JwtAuthGuard)
export class ClothesController {
  constructor(private readonly clothesService: ClothesService) {}

  @Post()
  create(@Body() createClothingDto: CreateClothingDto) {
    return this.clothesService.create(createClothingDto);
  }

  @Get()
  findAll() {
    return this.clothesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clothesService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.clothesService.findByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClothingDto: UpdateClothingDto) {
    return this.clothesService.update(id, updateClothingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clothesService.remove(id);
  }
}
