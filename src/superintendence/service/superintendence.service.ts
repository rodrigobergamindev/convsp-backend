import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateSuperintendenceDTO } from 'src/superintendence/dto/CreateSuperintendenceDTO';
import { PrismaService, Superintendence } from 'src/prisma/module';
import { UpdateSuperintendenceDTO } from '../dto/UpdateSuperintendenceDTO';

@Injectable()
export class SuperintendenceService {

    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

        async findAll(): Promise<Superintendence[]>{
        const superintendence = await this.prisma.superintendence.findMany()
      
        return superintendence
        }
    
        async findById(id: string): Promise<Superintendence> {
          const superintendence = await this.prisma.superintendence.findUnique({
            where: {
                id
            },
            include: {
                church: true,
                matriz: true, 
                superintendent: true
            }
          })
        
          return superintendence
      
        }
    
        async findByName(name: string): Promise<Superintendence> {
        
          const superintendence = await this.prisma.superintendence.findUnique({
            where: {
              name
            },
            include: {
              church: true,
              matriz: true,
              superintendent: true
          }
          })
        
          return superintendence
        }
    
    
    
    
        async create(matrizId: string, superintendentId: string, data: CreateSuperintendenceDTO) {
          
            const createSuperintendence = await this.prisma.superintendence.create({
              data: {
                ...data,
                superintendent: {
                  connect: {
                    id: superintendentId
                  }
                },
                matriz: {
                  connect: {
                    id: matrizId
                  }
                },
                church: {
                  connect: {
                    id: matrizId
                  }
                }
              }
            })
          }

        async update(superintendenceId: string, superintendentId: string, matrizId: string, data: UpdateSuperintendenceDTO){
            const updateSuperintendence = await this.prisma.superintendence.update({
                where: {
                    id: superintendenceId
                },
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

        async delete(superintendenceId: string){
            
            await this.prisma.superintendence.delete({
                where: {
                    id: superintendenceId
                }
            })
            

            }

        

        }

    
