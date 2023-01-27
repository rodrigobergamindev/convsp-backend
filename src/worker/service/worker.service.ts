import { Injectable } from '@nestjs/common';
import { Church, Worker, WorkerAddress } from '@prisma/client';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { CreateWorkerAddressDTO } from '../dto/CreateWorkerAddressDTO';
import { CreateWorkerDTO } from '../dto/CreateWorkerDTO';
import { UpdateWorkerAddressDTO } from '../dto/UpdateWorkerAddressDTO';
import { UpdateWorkerChurchDTO } from '../dto/UpdateWorkerChurchDTO';
import { UpdateWorkerDTO } from '../dto/UpdateWorkerDTO';


@Injectable()
export class WorkerService {

    constructor(private readonly prisma: PrismaService) {}


    async create(data: CreateWorkerDTO) {

        const worker = await this.prisma.worker.create({
          data
         })
         
         return worker
         
       }

    async createWorkerAddress(id: string, address: CreateWorkerAddressDTO): Promise<void>{
        await this.prisma.workerAddress.create({
          data: {
            ...address, 
            worker: {
              connect: {
                id
              }
            }
          },
        })
      }
      
    async update(id: string, worker: UpdateWorkerDTO): Promise<void> {
     
        await this.prisma.worker.update({
          where: {
            id: id
          },
          data: {
            ...worker,
          }
        })
        
        
      } 

    async findAll(): Promise<Worker[]>{
        const workers = await this.prisma.worker.findMany()
      
        return workers
        }

    async delete(id: string): Promise<void> {
      
          await this.prisma.worker.delete({
            where: {
              id
            }
          })
    
        }
      

    async findById(id: string): Promise<Worker> {
          const worker = await this.prisma.worker.findUnique({
            where: {
                id
            }
          })
        
          return worker
      
        }

    async findByName(name: string): Promise<Worker[]> {
          const worker = await this.prisma.worker.findMany({
            where: {
              name: {
                contains: name
              }
            }
          })
        
          return worker
        }

    async findByCPF(cpf: string): Promise<Worker> {
          const worker = await this.prisma.worker.findUnique({
            where: {
              cpf
            }
          })
        
          return worker
        }

    async findByCode(code: string): Promise<Worker> {
        const worker = await this.prisma.worker.findUnique({
          where: {
            code
          }
        })

        return worker
    }


    /** WORKER ADDRESS */

    async updateAddress(id: string, address: UpdateWorkerAddressDTO): Promise<void>{
      await this.prisma.workerAddress.update({
        where: {
          id
        },
        data: {
          ...address
        }
      })
      
    }

    async findAddress(workerId: string): Promise<WorkerAddress>{
      const address = this.prisma.workerAddress.findUnique({
        where: {
          workerId
        }
      })

      return address
    }

    async deleteAddress(id: string): Promise<void>{
      await this.prisma.workerAddress.delete({
        where: {
          id
        }
      })
    }

    async updateWorkerChurch(id: string, church: UpdateWorkerChurchDTO): Promise<void>{

      await this.prisma.church.update({
        where: {
          code: church.code
        },
        data: {
          workers: {
            connect: {
              id
            }
          }
        }
      })
    }

    async findChurch(churchId: string): Promise<Church>{
      const workerChurch = this.prisma.church.findUnique({
        where: {
          id: churchId
        }
      })

      return workerChurch
    }
    

}
