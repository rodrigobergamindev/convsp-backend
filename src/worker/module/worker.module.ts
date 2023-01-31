import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/module';
import { WorkerController } from '../controller/worker.controller';
import { WorkerService } from '../service/worker.service';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService, PrismaService, ConfigService]
})
export class WorkerModule {}
