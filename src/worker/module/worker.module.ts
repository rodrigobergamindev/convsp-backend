import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChurchValidationExistPipe } from 'src/church/pipes/ChurchValidationPipe';
import { PrismaService } from 'src/prisma/module';
import { WorkerController } from '../controller/worker.controller';
import { WorkerService } from '../service/worker.service';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService, PrismaService, ConfigService, ChurchValidationExistPipe]
})
export class WorkerModule {}
