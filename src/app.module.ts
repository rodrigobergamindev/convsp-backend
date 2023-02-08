import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/module/worker.module';
import { PrismaModule } from './prisma/module/prisma.module';
import { ChurchModule } from './church/module/church.module';
import { SuperintendenceModule } from './superintendence/module/superintendence.module';



@Module({
  imports: [WorkerModule, PrismaModule, ChurchModule, SuperintendenceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
