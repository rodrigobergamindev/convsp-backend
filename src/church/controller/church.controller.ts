import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Church } from '@prisma/client';
import { CreateChurchDTO } from '../dto/CreateChurchDTO';
import { UpdateChurchDTO } from '../dto/UpdateChurchDTO';
import { ChurchValidationAlreadyExistPipe, ChurchValidationExistPipe } from '../pipes/ChurchValidationPipe';
import { ChurchService } from '../service/church.service';

@Controller('api/church')
export class ChurchController {

    constructor(private readonly churchService: ChurchService) {}

    @Post()
    @UsePipes(ValidationPipe, ChurchValidationAlreadyExistPipe)
        async create(
            @Body() church: CreateChurchDTO): Promise<void>{
                await this.churchService.create(church)
        }
    

    @Post(':id/fileUpload')
    @UseInterceptors(FilesInterceptor('files'))
        async uploadFile(
            @Param('id', ChurchValidationExistPipe) id: string,
            @UploadedFiles() files: Express.Multer.File[]): Promise<any> {
                await this.churchService.fileUpload(id, files);
    
        }
    
        @Delete(':id/deleteFiles')
        async deleteFile(
            @Param('id', ChurchValidationExistPipe) id: string, 
            @Body() files: string[]): Promise<any> {
                await this.churchService.deleteFiles(files)
    
        }


        @Put(':id')
        @UsePipes(ValidationPipe)
        async update(
              @Param('id', ChurchValidationExistPipe) id: string, @Body() church: UpdateChurchDTO): Promise<void>{
                   await this.churchService.update(id, church)
            }
        
            
        @Delete(':id')
        async deleteUser(
            @Param('id', ChurchValidationExistPipe) id : string): Promise<void> {
              
                await this.churchService.delete(id)
            }


        @Get('code/:code')
            async getWorkerByCode(
                @Param('code') code : string): Promise<Church> {
                    const church = await this.churchService.findByCode(code)
                    if(!church) throw new NotFoundException({statusCode: 404, message: "Worker Not Found"})
                    return church
            }
        
        @Get('generateCode')
        async generateCode() {
                const code = await this.churchService.generateCode()
                if(!code) throw new NotFoundException({statusCode: 404, message: "Erro ao gerar código"})
                return code
        }

        @Get('name/:name')
        async getChurchByName(
            @Param('name') name : string): Promise<Church[]> {
                const church = await this.churchService.findByName(name)
                return church
        }

        @Get('id/:id')
        async getChurchById(
            @Param('id') id : string): Promise<Church> {
                const church = await this.churchService.findById(id)
                if(!church) throw new NotFoundException({statusCode: 404, message: "Church Not Found"})
                return church
            }

        @Get()
            async getChurches(): Promise<Church[]>{
                const workers = await this.churchService.findAll();
                return workers
            }
}
