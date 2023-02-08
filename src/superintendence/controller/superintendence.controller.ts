import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Superintendence } from '@prisma/client';
import { WorkerValidationExistPipe } from 'src/worker/pipes/WorkerValidationPipe';
import { CreateSuperintendenceDTO } from '../dto/CreateSuperintendenceDTO';
import { SuperintendenceValidationAlreadyExistPipe, SuperintendenceValidationExistPipe } from '../pipes/SuperintendenceValidationPipe';
import { SuperintendenceService } from '../service/superintendence.service';

@Controller('api/superintendence')
export class SuperintendenceController {

    constructor(private readonly superintendenceService: SuperintendenceService) {}


    @Post(':matrizId/:superintendentId')
    @UsePipes(ValidationPipe)
        async create(
            @Param('matrizId') matrizId: string,
            @Param('superintendentId') superintendentId: string,
            @Body(SuperintendenceValidationAlreadyExistPipe) data: CreateSuperintendenceDTO
            ): Promise<void>{
                
                await this.superintendenceService.create(matrizId, superintendentId,data)
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

        @Delete(':id')
        async deleteUser(
            @Param('id', SuperintendenceValidationExistPipe) id : string): Promise<void> {
              
                await this.superintendenceService.delete(id)
            }

}
