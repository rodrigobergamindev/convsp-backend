import { Module } from '@nestjs/common';
import { WorkerController } from '../controller/worker.controller';
import { WorkerService } from '../service/worker.service';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService]
})
export class WorkerModule {}
