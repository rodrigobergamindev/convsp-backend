import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/module/worker.module';
import { PrismaModule } from './prisma/module/prisma.module';


@Module({
  imports: [WorkerModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
