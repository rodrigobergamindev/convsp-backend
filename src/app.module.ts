import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/module/worker.module';
import { PrismaModule } from './prisma/module/prisma.module';
import { ChurchModule } from './church/module/church.module';



@Module({
  imports: [WorkerModule, PrismaModule, ChurchModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
