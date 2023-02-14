import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Superintendence } from '@prisma/client';
import { ChurchValidationExistPipe } from 'src/church/pipes/ChurchValidationPipe';
import { WorkerValidationExistPipe } from 'src/worker/pipes/WorkerValidationPipe';
import { CreateSuperintendenceDTO } from '../dto/CreateSuperintendenceDTO';
import { UpdateSuperintendenceDTO } from '../dto/UpdateSuperintendenceDTO';
import { SuperintendenceValidationAlreadyExistPipe, SuperintendenceValidationExistPipe } from '../pipes/SuperintendenceValidationPipe';
import { SuperintendenceService } from '../service/superintendence.service';

@Controller('api/superintendence')
export class SuperintendenceController {

    constructor(private readonly superintendenceService: SuperintendenceService) {}


    @Post(':superintendentId')
    @UsePipes(ValidationPipe)
        async create(
            @Param('superintendentId') superintendentId: string,
            @Body(SuperintendenceValidationAlreadyExistPipe) data: CreateSuperintendenceDTO
            ): Promise<void>{
                
                await this.superintendenceService.create(superintendentId,data)
        }

    @Put(':superintendenceId/:superintendentId')
    @UsePipes(ValidationPipe)
        async update(
            @Param('superintendenceId', SuperintendenceValidationExistPipe) superintendenceId: string,
            @Param('superintendentId', WorkerValidationExistPipe) superintendentId: string,
            @Body() data: UpdateSuperintendenceDTO
            ): Promise<void>{
                
                await this.superintendenceService.update(superintendenceId, superintendentId, data)
        }

        @Get()
        async getSuperintendences(): Promise<Superintendence[]>{
            const superintendences = await this.superintendenceService.findAll();
            return superintendences
        }

        @Get('name/:name')
        async getSuperintendenceByName(
            @Param('name') name : string): Promise<Superintendence> {
                const superintendence = await this.superintendenceService.findByName(name)
                return superintendence
        }

        @Get('id/:id')
        async getSuperintendenceById(
            @Param('id') id : string): Promise<Superintendence> {
                const superintendence = await this.superintendenceService.findById(id)
                return superintendence
        }

        @Delete(':id')
        async deleteUser(
            @Param('id', SuperintendenceValidationExistPipe) id : string): Promise<void> {
              
                await this.superintendenceService.delete(id)
            }



        /*ADD AND REMOVE CHURCHES TO SUPERINTENDENCE*/

        @Patch('church/remove/:superintendenceId/:churchId')
        async removeChurch(
            @Param('churchId', ChurchValidationExistPipe) churchId: string,
            @Param('superintendenceId', SuperintendenceValidationExistPipe) superintendenceId: string
            ): Promise<void> {
                await this.superintendenceService.removeChurch(churchId, superintendenceId)
            }
        
        @Patch('church/add/:superintendenceId/:churchId')
        async addChurch(
            @Param('churchId', ChurchValidationExistPipe) churchId: string,
            @Param('superintendenceId', SuperintendenceValidationExistPipe) superintendenceId: string
            ): Promise<void> {
                await this.superintendenceService.addChurch(churchId, superintendenceId)
            }


        /**ADD AND REMOVE SUPERINTENDENT */

        @Patch('superintendent/add/:superintendenceId/:workerId')
        async addSuperintendent(
            @Param('workerId', WorkerValidationExistPipe) workerId: string,
            @Param('superintendenceId', SuperintendenceValidationExistPipe) superintendenceId: string
            ): Promise<void> {
                await this.superintendenceService.addSuperintendent(workerId, superintendenceId)
            }
        
        @Patch('superintendent/remove/:superintendenceId/:workerId')
        async removeSuperintendent(
                @Param('workerId', WorkerValidationExistPipe) workerId: string,
                @Param('superintendenceId', SuperintendenceValidationExistPipe) superintendenceId: string
                ): Promise<void> {
                    await this.superintendenceService.removeSuperintendent(superintendenceId)
                }
        

}
