import { Module } from '@nestjs/common';
import { ChurchService } from '../service/church.service';
import { ChurchController } from '../controller/church.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/module';
import { SuperintendenceService } from 'src/superintendence/service/superintendence.service';

@Module({
  providers: [ChurchService, ConfigService, PrismaService, SuperintendenceService],
  controllers: [ChurchController]
})
export class ChurchModule {}
