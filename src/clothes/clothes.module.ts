import { Module } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { ClothesController } from './clothes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ClothesController],
  providers: [ClothesService],
  imports: [PrismaModule],
  exports: [ClothesService]
})
export class ClothesModule {}
