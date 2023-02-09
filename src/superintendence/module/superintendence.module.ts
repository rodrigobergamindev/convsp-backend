import { Module } from '@nestjs/common';
import { SuperintendenceService } from '../service/superintendence.service';
import { SuperintendenceController } from '../controller/superintendence.controller';
import { PrismaModule, PrismaService } from 'src/prisma/module';
import { ConfigService } from '@nestjs/config';
import { ChurchService } from 'src/church/service/church.service';

@Module({
  providers: [SuperintendenceService, PrismaService, ConfigService, ChurchService],
  controllers: [SuperintendenceController]
})
export class SuperintendenceModule {}
