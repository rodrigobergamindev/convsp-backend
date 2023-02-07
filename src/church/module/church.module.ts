import { Module } from '@nestjs/common';
import { ChurchService } from '../service/church.service';
import { ChurchController } from '../controller/church.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/module';

@Module({
  providers: [ChurchService, ConfigService, PrismaService],
  controllers: [ChurchController]
})
export class ChurchModule {}
