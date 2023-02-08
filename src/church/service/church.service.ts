import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Church, ChurchAddress, ChurchAnnotation, PrismaService } from 'src/prisma/module';
import { CreateChurchDTO } from '../dto/CreateChurchDTO';
import {v4 as uuid} from 'uuid'
import { UpdateChurchDTO } from '../dto/UpdateChurchDTO';
import { CreateChurchAnnotationDTO } from '../dto/CreateChurchAnnotationDTO';
import { UpdateChurchAnnotationDTO } from '../dto/UpdateChurchAnnotationDTO';
import { CreateSuperintendenceDTO } from '../dto/CreateSuperintendenceDTO';


@Injectable()
export class ChurchService {

  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}


  async findAll(): Promise<Church[]>{
    const churches = await this.prisma.church.findMany()
  
    return churches
    }

    async findById(id: string): Promise<Church> {
      const church = await this.prisma.church.findUnique({
        where: {
            id
        },
        include: {
          address: true,
          annotations: true,
          board: true,
          congregations: true,
          document: true,
          headquarter: true,
          superintendence: true,
          workers: true
        }
      })
    
      return church 
  
    }

    async findByName(name: string): Promise<Church[]> {
      const church = await this.prisma.church.findMany({
        where: {
          name: {
            contains: name
          }
        }
      })
    
      return church
    }



    async findByCode(code: string): Promise<Church> {

      const church = await this.prisma.church.findUnique({
        where: {
          code
        },
        include: {
          address: true,
          annotations: true,
          board: true,
          congregations: true,
          document: true,
          headquarter: true,
          superintendence: true,
          workers: true
        }
      })

      return church
    }




    async create(data: CreateChurchDTO) {

      const church = await this.prisma.church.create({
        data: {
          ...data, 
 
          address: {
            create: {
              ...data.address as ChurchAddress
            }
          }
        }
      })
       
          
    }


    async fileUpload(churchId: string, files: Express.Multer.File[]): Promise<void>{

        const filesToUpload = await Promise.all(files.map(async (file) => {
          const s3 = new S3()
  
          if(file.mimetype.includes('pdf')){
            
            const uploadResult = await s3.upload({
              Bucket: this.configService.get('AWS_BUCKET_NAME'), 
              Body: file.buffer,
              Key: `${uuid()}-${file.originalname}`
            }).promise()
            
            
            
            if(uploadResult.Location){
              await this.prisma.churchDocument.create({
                data: {
                  key: uploadResult.Key,
                  url: uploadResult.Location,
                  church: {
                    connect: {
                      id: churchId
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
            await this.prisma.churchDocument.delete({
              where: {
                key: file
              }
            })
          }
  
          
          
        }))
      }




      async generateCode(){

        const searchLastCode = await this.prisma.church.findFirst({
          orderBy: {
            code: 'desc'
          }
        })
        
        const newCode = parseInt(searchLastCode.code) + 1
        return newCode
    
      }
    

      async update(id: string, data: UpdateChurchDTO): Promise<void> {
     
        await this.prisma.church.update({
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


      async delete(id: string): Promise<void> {
      
        await this.prisma.church.delete({
          where: {
            id
          }
        })
  
      }


      /*ANNOTATIONS*/

      async createAnnotation(churchId: string, data: CreateChurchAnnotationDTO): Promise<void> {

        const createAnnotation = await this.prisma.churchAnnotation.create({
          data: {
            ...data,
            church: {
              connect: {
                id: churchId
              }
            }
          }
        })
      }

      async findAllAnnotations(churchId: string): Promise<ChurchAnnotation[]> {
        const annotations = await this.prisma.churchAnnotation.findMany({
          where: {
            churchId
          }
        })
        return annotations
      }

      async findAnnotation(annotationId: string): Promise<ChurchAnnotation> {

        const annotation = await this.prisma.churchAnnotation.findUnique({
          where: {
            id: annotationId
          }
        })

        return annotation
      }

      async updateAnnotation(annotationId: string, data: UpdateChurchAnnotationDTO): Promise<void> {

        const updateAnnotation = await this.prisma.churchAnnotation.update({
          where: {
            id: annotationId
          },
          data
        })
      }

      async deleteAnnotation(annotationId: string): Promise<void> {
        const deleteAnnotation = await this.prisma.churchAnnotation.delete({
          where: {
            id: annotationId
          }
        })
      }

      /** SUPERINTENDENCE */

      async createSuperintendence(matrizId: string, superintendentId: string, data: CreateSuperintendenceDTO) {

        const createSuperintendence = await this.prisma.superintendence.create({
          data: {
            ...data,
            matriz: {
              connect: {
                id: matrizId
              }
            },
            superintendent: {
              connect: {
                id: superintendentId
              }
            }
          }
        })
      }


}
