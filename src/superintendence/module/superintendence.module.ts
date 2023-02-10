import { Module } from '@nestjs/common';
import { SuperintendenceService } from '../service/superintendence.service';
import { SuperintendenceController } from '../controller/superintendence.controller';
import { PrismaModule, PrismaService } from 'src/prisma/module';
import { ConfigService } from '@nestjs/config';
import { ChurchService } from 'src/church/service/church.service';
import { WorkerService } from 'src/worker/service/worker.service';

@Module({
  providers: [SuperintendenceService, PrismaService, ConfigService, ChurchService, WorkerService],
  controllers: [SuperintendenceController]
})
export class SuperintendenceModule {}
