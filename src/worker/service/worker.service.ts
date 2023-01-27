import { Injectable } from '@nestjs/common';
import { Worker } from '@prisma/client';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { CreateWorkerAddressDTO } from '../dto/CreateWorkerAddressDTO';
import { CreateWorkerDTO } from '../dto/CreateWorkerDTO';
import { UpdateWorkerAddressDTO } from '../dto/UpdateWorkerAddressDTO';
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

    async findByCPF(cpf: string): Promise<Worker[]> {
          const worker = await this.prisma.worker.findMany({
            where: {
              cpf: {
                contains: cpf
              }
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

    
}
