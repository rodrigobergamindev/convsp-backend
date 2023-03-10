import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Board, Church, ChurchAddress, ChurchAnnotation, PrismaService } from 'src/prisma/module';
import { CreateChurchDTO } from '../dto/CreateChurchDTO';
import {v4 as uuid} from 'uuid'
import { UpdateChurchDTO } from '../dto/UpdateChurchDTO';
import { CreateChurchAnnotationDTO } from '../dto/CreateChurchAnnotationDTO';
import { UpdateChurchAnnotationDTO } from '../dto/UpdateChurchAnnotationDTO';
import { CreateSuperintendenceDTO } from '../../superintendence/dto/CreateSuperintendenceDTO';
import { CreateBoardDTO } from '../dto/CreateBoardDTO';
import { UpdateBoardDTO } from '../dto/UpdateBoardDTO';
import {Readable} from 'stream'
import { parse } from 'csv-parse';
import { Transform } from 'node:stream'
import { CreateChurchAddressDTO } from '../dto/CreateChurchAddressDTO';
import { UpdateChurchAddressDTO } from '../dto/UpdateChurchAddressDTO';

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
          board: {
            include: {
              leader: true,
              president: true
            }
          },
          congregations: true,
          document: true,
          headquarter: true,
          superintendence: {
            include: {
              superintendent: true
            }
          },
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
          board: {
            include: {
              leader: true,
              president: true
            }
          },
          congregations: true,
          document: true,
          headquarter: true,
          superintendence: {
            include: {
              superintendent: true
            }
          },
          workers: true
        }
      })

      return church
    }

    async create(data: CreateChurchDTO) {

      const church = await this.prisma.church.create({
        data: {
          ...data
        }
      })

      
       
          
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
          ...data
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



    /*FILES*/

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
    
    async importData(file: Express.Multer.File): Promise<void> {

      const {buffer} = file

      const parser = parse({
        delimiter:';',
        fromLine: 2,
        encoding: 'utf-8'
      })

      const readableFile = new Readable()
      readableFile.push(Buffer.from(buffer))
      readableFile.push(null)
      

     
     const data = await readableFile.pipe(parser).on("data", async (row) => {
        const [code, name, situacao, cnpj, type,
        place, district, city, state, zip_code, phoneNumber,email,
        templo, membros,superintendence, region,
          type_correspondence, place_correspondence,
          district_correspondence, city_correspondence, state_correspondence,
          zip_code_correspondence, content, title, created_at
        ] = row
 
        const splitDate = created_at.split('/').reverse()
        const convertedDate = new Date(`${splitDate[0]}-${splitDate[1]}-${splitDate[2]}`)
        
       
          const importData = await this.prisma.church.create({
            data: {
               code,
               name,
               situacao,
               cnpj,
               phoneNumber,
               email,
               templo,
               membros: parseInt(membros),
               address: {
                createMany: {
                  data: [
                    {
                      type,
                      place,
                      district,
                      city,
                      state,
                      zip_code
                    },
                    {
                      type: type_correspondence,
                      place: place_correspondence,
                      district: district_correspondence,
                      city: city_correspondence,
                      state: state_correspondence,
                      zip_code: zip_code_correspondence
                    },
                  ]
                }
               },
               annotations: {
                create: {
                  content,
                  title,
                  createdAt: convertedDate
                }
               },
               superintendence: {
                connectOrCreate: {
                  where: {
                    name: superintendence
                  },
                  create: {
                    name: superintendence,
                    region
                  }
                }
               }
            }
          })
 
      })
       
    }

      /**SUPERINTENDENCE */

      async updateSuperintendence(churchId: string, superintendenceId: string): Promise<void> {

        const updateSuperintendence =  await this.prisma.church.update({
          where: {
            id: churchId
          },
          data: {
            superintendence: {
              connect: {
                id: superintendenceId
              }
            }
          }
        })
      }

      async findSuperintendenceChurch(churchId: string): Promise<Church> {

        const superintendenceChurch = await this.prisma.church.findUnique({
          where: {
            id: churchId
          },
          include: {
            superintendence: {
              include: {
                superintendent: true
              }
            }
          }
        })

        return superintendenceChurch
      }

      async deleteSuperintendenceChurch(churchId: string): Promise<void> {

        const createSuperintendence =  await this.prisma.church.update({
          where: {
            id: churchId
          },
          data: { 
            superintendence: {
              disconnect: true
            }
          }
        })
      }


      /*BOARD*/

      async createChurchBoard(churchId: string, 
        presidentId: string, 
        leaderId: string, 
        data: CreateBoardDTO): Promise<void> {
 
          const createChurchBoard = await this.prisma.board.create({
            data: {
              ...data,
              president: {
                connect: {
                  id: presidentId
                }
              },
              leader: {
                connect: {
                  id: leaderId
                }
              },
              church: {
                connect: {
                  id: churchId
                }
              }
            }
          })
      
        
      }

      async updateChurchBoard(
        boardId: string,
        churchId: string, 
        presidentId: string, 
        leaderId: string, 
        data: UpdateBoardDTO
      ): Promise<void> {
        

        const createChurchBoard = await this.prisma.board.update({

        where: {
          id: boardId
        },
          data: {
            ...data,
            president: {
              connect: {
                id: presidentId
              }
            },
            leader: {
              connect: {
                id: leaderId
              }
            },
            church: {
              connect: {
                id: churchId
              }
            }
          }
        })

      }

      async findBoardById(boardId: string): Promise<Board>{

        const board = await this.prisma.board.findUnique({
          where: {
            id: boardId
          }
        })

        return board
      }

      async deleteBoard(boardId: string): Promise<void> {
        const deleteBoard = await this.prisma.board.delete({
          where: {
            id: boardId
          }
        })
      }


      /**HEADQUARTER */

      async updateHeadquarterChurch(churchId: string, headquarterId: string): Promise<void> {

        const headquarter = await this.prisma.church.update({
          where: {
            id: churchId
          },
          data: {
            headquarter: {
              connect: {
                id: headquarterId
              }
            }
          }
        })
      }

      async deleteHeadquarterChurch(churchId: string): Promise<void> {

        const deleteHeadquarter = await this.prisma.church.update({
          where: {
            id: churchId
          },
          data: {
            headquarter: {
              disconnect: true
            }
          }
        })
      }


    /**CHURCH ANNOTATION */


    async createAnnotationForChurch(churchId: string, data: CreateChurchAnnotationDTO): Promise<void> {
        
      const updateAnnotationForChurch = await this.prisma.churchAnnotation.create({
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

    async updateAnnotationForChurch(idAnnotation: string, data: UpdateChurchAnnotationDTO): Promise<void> {
        
      const updateAnnotationForChurch = await this.prisma.churchAnnotation.update({
        where: {
          id: idAnnotation
        },
        data: {
          ...data
        }
      })
    }

    async findAnnotationById(idAnnotation: string): Promise<ChurchAnnotation> {
        
      const churchAnnotation = await this.prisma.churchAnnotation.findUnique({
        where: {
          id: idAnnotation
        }
      })

      return churchAnnotation
    }

    async deleteAnnotationForChurch(idAnnotation: string): Promise<void> {
        
      const churchAnnotation = await this.prisma.churchAnnotation.delete({
        where: {
          id: idAnnotation
        }
      })


    }


     /** CHURCH ADDRESS */

     async createChurchAddress(churchId: string, data: CreateChurchAddressDTO): Promise<void> {
        
      const createAddress = await this.prisma.churchAddress.create({
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

    async updateChurchAddress(churchAddressId: string, data: UpdateChurchAddressDTO): Promise<void> {
        
        const updateAddress = await this.prisma.churchAddress.update({
          where: {
            id: churchAddressId
          },
          data: {
            ...data
          }
        })
    }
 
    async findChurchAddress(churchAddressId: string): Promise<ChurchAddress> {

      const churchAddress = await this.prisma.churchAddress.findUnique({
        where: {
          id: churchAddressId
        }
      })

      return churchAddress
    }

}
