import { Module } from '@nestjs/common';
import { SuperintendenceService } from '../service/superintendence.service';
import { SuperintendenceController } from '../controller/superintendence.controller';

@Module({
  providers: [SuperintendenceService],
  controllers: [SuperintendenceController]
})
export class SuperintendenceModule {}
