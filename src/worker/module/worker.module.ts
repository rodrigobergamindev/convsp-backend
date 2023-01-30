import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/module';
import { WorkerController } from '../controller/worker.controller';
import { WorkerService } from '../service/worker.service';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService, PrismaService]
})
export class WorkerModule {}
