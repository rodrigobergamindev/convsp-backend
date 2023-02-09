import { Injectable } from '@nestjs/common';
import { Church, Document, Worker, WorkerAddress, WorkerAnnotation } from '@prisma/client';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { CreateWorkerAddressDTO } from '../dto/CreateWorkerAddressDTO';
import { CreateWorkerDTO } from '../dto/CreateWorkerDTO';
import { UpdateWorkerChurchDTO } from '../dto/UpdateWorkerChurchDTO';
import { UpdateWorkerDTO } from '../dto/UpdateWorkerDTO';
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
import {v4 as uuid} from 'uuid'
import { CreateWorkerAnnotationDTO } from '../dto/CreateWorkerAnnotationDTO';
import { UpdateWorkerAnnotationDTO } from '../dto/UpdateWorkerAnnotationDTO';
const mercadopago = require('mercadopago')


@Injectable()
export class WorkerService {

    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}


    async create(data: CreateWorkerDTO) {

        const worker = await this.prisma.worker.create({
          data: {
            ...data,
            address: {
              create: {
                ...data.address as WorkerAddress
              }
            }
          }
         })
         
         return worker
         
       }

    async fileUpload(workerId: string, files: Express.Multer.File[]): Promise<void>{

      const filesToUpload = await Promise.all(files.map(async (file) => {
        const s3 = new S3()

        if(file.mimetype.includes('pdf')){
          
          const uploadResult = await s3.upload({
            Bucket: this.configService.get('AWS_BUCKET_NAME'), 
            Body: file.buffer,
            Key: `${uuid()}-${file.originalname}`
          }).promise()
          
          
          
          if(uploadResult.Location){
            await this.prisma.document.create({
              data: {
                key: uploadResult.Key,
                url: uploadResult.Location,
                worker: {
                  connect: {
                    id: workerId
                  }
                }
              }
            })
          }
          
         }

       }))
    }

    async deleteFiles(files: string[]): Promise<void> {
      const filesToDelete = await Promise.all(files.map(async (file) => {
        const s3 = new S3()

        const deleteResult = await s3.deleteObject({
          Bucket:this.configService.get('AWS_BUCKET_NAME'),
          Key: file
        }).promise()

        if(deleteResult) {
          await this.prisma.document.delete({
            where: {
              key: file
            }
          })
        }

        
        
      }))
    }
    
    async generateCode(){

      const searchLastCode = await this.prisma.worker.findFirst({
        orderBy: {
          code: 'desc'
        }
      })
      
      const newCode = parseInt(searchLastCode.code) + 1
      return newCode

    }


    async update(id: string, data: UpdateWorkerDTO): Promise<void> {
     
        await this.prisma.worker.update({
          where: {
            id: id
          },
          data: {
            ...data,
            address: {
              update: {
                ...data.address
              }
            }
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
            },
            include: {
              document: true,
              church: true,
              address: true
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
            },
            include: {
              document: true,
              church: true,
              address: true
            }
          })
        
          return worker
        }

    async findByCode(code: string): Promise<Worker> {

      

        const worker = await this.prisma.worker.findUnique({
          where: {
            code
          },
          include: {
            document: true,
            church: true,
            address: true,
            annotations: true,
            leader: true,
            superintendence: true,
            president: true
          }
        })

        return worker
    }


    /** WORKER ADDRESS */

    


    async updateChurchForWorker(id: string, churchId: string): Promise<void> {
        
      const updateChurchForWorker = await this.prisma.worker.update({
        where: {
          id
        }, 
        data: {
          church: {
            connect: {
              id: churchId
            }
          }
        }
      })
    }


    /*WORKER ANNOTATION*/

    async createAnnotationForWorker(workerId: string, data: CreateWorkerAnnotationDTO): Promise<void> {
        
      const updateAnnotationForWorker = await this.prisma.workerAnnotation.create({
        data: {
         ...data,
         worker: {
          connect: {
            id: workerId
          }
         }
        }
      })
    }

    async updateAnnotationForWorker(idAnnotation: string, data: UpdateWorkerAnnotationDTO): Promise<void> {
        
      const updateAnnotationForWorker = await this.prisma.workerAnnotation.update({
        where: {
          id: idAnnotation
        },
        data: {
          ...data
        }
      })
    }

    async findAnnotationById(idAnnotation: string): Promise<WorkerAnnotation> {
        
      const workerAnnotation = await this.prisma.workerAnnotation.findUnique({
        where: {
          id: idAnnotation
        }
      })

      return workerAnnotation
    }

    async deleteAnnotationForWorker(idAnnotation: string): Promise<void> {
        
      const workerAnnotation = await this.prisma.workerAnnotation.delete({
        where: {
          id: idAnnotation
        }
      })


    }


























        /**

    async payment(){
      await mercadopago.configure({
        access_token: this.configService.get('MERCADOPAGO_ACCESS_KEY')
      })

      const preference = await mercadopago.payment.create({
        payer: {
          email: 'rodrigobergamindev@gmail.com',
          first_name: 'Rodrigo',
          last_name: 'Silva',
          identification: {
            type: 'cpf',
            number: '45177620840'
          }
        },
        description: 'ANUIDADE MINISTERIAL',
        transaction_amount: 183.22,
        payment_method_id: 'bolbradesco',
        installments: 1
      })

      return await preference.response
    }
 */

}
