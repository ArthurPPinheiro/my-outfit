import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OutfitsService } from './outfits.service';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { UpdateOutfitDto } from './dto/update-outfit.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('outfits')
// @UseGuards(JwtAuthGuard)
export class OutfitsController {
  constructor(private readonly outfitsService: OutfitsService) {}

  @Post()
  create(@Body() createOutfitDto: CreateOutfitDto) {
    return this.outfitsService.create(createOutfitDto);
  }

  @Get()
  findAll() {
    return this.outfitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outfitsService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.outfitsService.findByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutfitDto: UpdateOutfitDto) {
    return this.outfitsService.update(id, updateOutfitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outfitsService.remove(id);
  }
}
