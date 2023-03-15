import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Church, Document, Prisma, Worker, WorkerAddress, WorkerAnnotation } from '@prisma/client';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { CreateWorkerAddressDTO } from '../dto/CreateWorkerAddressDTO';
import { CreateWorkerDTO } from '../dto/CreateWorkerDTO';
import { UpdateWorkerDTO } from '../dto/UpdateWorkerDTO';
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
import {v4 as uuid} from 'uuid'
import { CreateWorkerAnnotationDTO } from '../dto/CreateWorkerAnnotationDTO';
import { UpdateWorkerAnnotationDTO } from '../dto/UpdateWorkerAnnotationDTO';
import { UpdateWorkerAddressDTO } from '../dto/UpdateWorkerAddressDTO';
import {Request} from 'express'
import mercadopago from 'mercadopago';


@Injectable()
export class WorkerService {

    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}


    /*CREATE, UPDATE AND DELETE*/
    async create(data: CreateWorkerDTO): Promise<void> {

        try {
          const createWorker = await this.prisma.worker.create({
            data: {
              ...data
            }
           })
        } catch (error) {
          if(error instanceof Prisma.PrismaClientKnownRequestError) {
              throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
          }
        }
      
         
       }

      async update(id: string, data: UpdateWorkerDTO): Promise<void> {
     
        try {
          const updateWorker = await this.prisma.worker.update({
            where: {
              id: id
            },
            data: {
              ...data
            }
          })
        } catch (error) {
          if(error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
        }
        }
        
        
      }

      async delete(id: string): Promise<void> {
      
        try {
          const deleteWorker = await this.prisma.worker.delete({
            where: {
              id
            }
          })
  
        } catch (error) {
          if(error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new HttpException(`${error.code}`, HttpStatus.FORBIDDEN)
        }
        }
  
      }
    

    /*FILE UPLOAD*/

    async fileUpload(workerId: string, files: Express.Multer.File[]): Promise<void>{

      try {
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
      } catch (error) {
      
        

        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
        }

      throw new HttpException(`Failed to upload files`, HttpStatus.BAD_REQUEST)
      }
    }

    async deleteFiles(files: string[]): Promise<void> {

      try {
        const filesToDelete = await Promise.all(files.map(async (file) => {
          const s3 = new S3()
  
          const deleteResult = await s3.deleteObject({
            Bucket:this.configService.get('AWS_BUCKET_NAME'),
            Key: file
          }).promise()
  
          if(deleteResult) {
            
            const deleteFiles = await this.prisma.document.delete({
              where: {
                key: file
              }
            })
          }
  
          
          
        }))
      } catch (error) {

        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          
          throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
        }
      throw new HttpException(`Failed to delete files`, HttpStatus.BAD_REQUEST)
      }

      
    }

    /*GENERATE CODE*/
    
    async generateCode(): Promise<Number>{

      try {
        const searchLastCode = await this.prisma.worker.findFirst({
          orderBy: {
            code: 'desc'
          }
        })
        
        const newCode = parseInt(searchLastCode.code) + 1
        return newCode

      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
        }
      }

      

    }


    /*FIND*/

    async findAll(): Promise<Worker[]>{
        const workers = await this.prisma.worker.findMany()
      
        return workers
        }


    async findById(id: string): Promise<Worker> {
       
          try {
            const worker = await this.prisma.worker.findUnique({
              where: {
                  id
              },
              include: {
                document: true,
                church: true,
                address: true,
                annotations: true,
                annuities: true,
                leader: true,
                president: true,
                superintendence: true
              }
            })
          
            return worker 
          } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
              throw new HttpException(`${error.code}`, HttpStatus.NOT_FOUND)
            }
          }
      
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

          try {
            const worker = await this.prisma.worker.findUnique({
              where: {
                cpf
              },
              include: {
                document: true,
                church: true,
                address: true,
                annotations: true,
                annuities: true,
                leader: true,
                president: true,
                superintendence: true
              }
            })
          
            return worker

          } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
              throw new HttpException(`${error.code}`, HttpStatus.NOT_FOUND)
            }
          }
      
          
        }

    async findByCode(code: string): Promise<Worker> {


      try {
        const worker = await this.prisma.worker.findUnique({
          where: {
            code
          },
          include: {
            document: true,
            church: true,
            address: true,
            annotations: true,
            annuities: true,
            leader: true,
            president: true,
            superintendence: true
          }
        })

        return worker 


      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
              throw new HttpException(`${error.code}`, HttpStatus.NOT_FOUND)
            }
      }

      

        
    }


    /** WORKER ADDRESS */

    async createWorkerAddress(workerId: string, data: CreateWorkerAddressDTO): Promise<void> {

      try {
        const createAddress = await this.prisma.workerAddress.create({
          data: {
            ...data,
            worker: {
              connect: {
                id: workerId
              }
            }
          }
        })
      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
        }
      }
        
      
    }

    async updateWorkerAddress(workerAddressId: string, data: UpdateWorkerAddressDTO): Promise<void> {

        try {
          const updateAddress = await this.prisma.workerAddress.update({
            where: {
              id: workerAddressId
            },
            data: {
              ...data
            }
          })
        } catch (error) {
          if(error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
          }
        }
        
        
    }
 
    async findWorkerAddress(workerAddressId: string): Promise<WorkerAddress> {

      try {
        const workerAddress = await this.prisma.workerAddress.findUnique({
          where: {
            id: workerAddressId
          }
        })
  
        return workerAddress
      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HttpException(`${error.code}`, HttpStatus.NOT_FOUND)
        }

      }

      
    }

    /*UPDATE CHURCH FOR WORKER*/
    async updateChurchForWorker(id: string, churchId: string): Promise<void> {
        
      try {
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
      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
        }
      }
    }


    /*WORKER ANNOTATION*/

    async createAnnotationForWorker(workerId: string, data: CreateWorkerAnnotationDTO): Promise<void> {

        
      try {
        const createAnnotationForWorker = await this.prisma.workerAnnotation.create({
          data: {
           ...data,
           worker: {
            connect: {
              id: workerId
            }
           }
          }
        })
      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
        }
      }
    }

    async updateAnnotationForWorker(idAnnotation: string, data: UpdateWorkerAnnotationDTO): Promise<void> {
        
      try {
        const updateAnnotationForWorker = await this.prisma.workerAnnotation.update({
          where: {
            id: idAnnotation
          },
          data: {
            ...data
          }
        })
      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HttpException(`${error.code}`, HttpStatus.BAD_REQUEST)
        }
      }
    }

    async findAnnotationById(idAnnotation: string): Promise<WorkerAnnotation> {
        
      try {
        const workerAnnotation = await this.prisma.workerAnnotation.findUnique({
          where: {
            id: idAnnotation
          }
        })
  
        return workerAnnotation
      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HttpException(`${error.code}`, HttpStatus.NOT_FOUND)
        }
      }
    }

    async deleteAnnotationForWorker(idAnnotation: string): Promise<void> {
        
      try {
        const workerAnnotation = await this.prisma.workerAnnotation.delete({
          where: {
            id: idAnnotation
          }
        })
      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HttpException(`${error.code}`, HttpStatus.FORBIDDEN)
        }
      }


    }



}
