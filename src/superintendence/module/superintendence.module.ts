import { Module } from '@nestjs/common';
import { SuperintendenceService } from '../service/superintendence.service';
import { SuperintendenceController } from '../controller/superintendence.controller';
import { PrismaModule } from 'src/prisma/module';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [SuperintendenceService, PrismaModule, ConfigService],
  controllers: [SuperintendenceController]
})
export class SuperintendenceModule {}
