import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/module';

@Injectable()
export class ChurchService {

  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}


    async create(data: CreateChurchDTO) {

        const worker = await this.prisma.worker.create({
          data: {
            ...data,
            address: {
              create: {
                ...data.address as WorkerAddress
              }
            },
            church: {
              connect: {
                code: data.church.connect.code
              }
            }
          }
         })
         
         return worker
         
       }
}
