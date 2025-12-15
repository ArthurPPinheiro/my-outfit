import { Module } from '@nestjs/common';
import { OutfitsService } from './outfits.service';
import { OutfitsController } from './outfits.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [OutfitsController],
  providers: [OutfitsService],
  imports: [PrismaModule],
  exports: [OutfitsService]
})
export class OutfitsModule {}
