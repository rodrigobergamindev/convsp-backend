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
                  },
                  church: {
                    connect: {
                      id: matrizId
                    }
                  }
                }
              })
            }

        async delete(superintendenceId: string){
            
           const deleteSuperintendence = await this.prisma.superintendence.delete({
                where: {
                    id: superintendenceId
                }
            })
            

            }


            /**ADD AND REMOVE CHURCHES */

        async removeChurch(churchId: string, superintendenceId: string) {

          const removeChurch = await this.prisma.superintendence.update({
            where: {
              id: superintendenceId
            },
            data: {
              church: {
                disconnect: {
                  id: churchId
                }
              }
            }
          })

        }

        async addChurch(churchId: string, superintendenceId: string) {

          const addChurch = await this.prisma.superintendence.update({
            where: {
              id: superintendenceId
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


        /**ADD AND REMOVE SUPERINTENDENT */
        
        async addSuperintendent(workerId: string, superintendenceId: string) {

          const addSuperintendent = await this.prisma.superintendence.update({
            where: {
              id: superintendenceId
            },
            data: {
              superintendent: {
                connect: {
                  id: workerId
                }
              }
            }
          })

        }

        async removeSuperintendent(workerId: string, superintendenceId: string) {

          const removeSuperintendent = await this.prisma.superintendence.update({
            where: {
              id: superintendenceId
            },
            data: {
              superintendent: {
                disconnect: true
              }
            }
          })

        }



        /**ADD AND REMOVE MATRIZ */


        async addMatriz(churchId: string, superintendenceId: string) {

          const addSuperintendent = await this.prisma.superintendence.update({
            where: {
              id: superintendenceId
            },
            data: {
              matriz: {
                connect: {
                  id: churchId
                }
              }
            }
          })

        }

        async removeMatriz(churchId: string, superintendenceId: string) {

          const removeSuperintendent = await this.prisma.superintendence.update({
            where: {
              id: superintendenceId
            },
            data: {
              matriz: {
                connect: {
                  id: churchId
                }
              }
            }
          })

        }



        }

    
