import { Module } from '@nestjs/common';
import { ChurchService } from '../service/church.service';
import { ChurchController } from '../controller/church.controller';

@Module({
  providers: [ChurchService],
  controllers: [ChurchController]
})
export class ChurchModule {}
