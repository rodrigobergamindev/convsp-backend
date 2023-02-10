import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Church } from '@prisma/client';
import { SuperintendenceValidationExistPipe } from 'src/superintendence/pipes/SuperintendenceValidationPipe';
import { SuperintendenceService } from 'src/superintendence/service/superintendence.service';
import { WorkerValidationExistPipe } from 'src/worker/pipes/WorkerValidationPipe';
import { CreateBoardDTO } from '../dto/CreateBoardDTO';
import { CreateChurchAnnotationDTO } from '../dto/CreateChurchAnnotationDTO';
import { CreateChurchDTO } from '../dto/CreateChurchDTO';
import { UpdateBoardDTO } from '../dto/UpdateBoardDTO';
import { UpdateChurchAnnotationDTO } from '../dto/UpdateChurchAnnotationDTO';
import { UpdateChurchDTO } from '../dto/UpdateChurchDTO';
import { BoardValidationExistPipe, ChurchAnnotationValidationExistPipe, ChurchValidationAlreadyExistPipe, ChurchValidationExistPipe } from '../pipes/ChurchValidationPipe';
import { ChurchService } from '../service/church.service';

@Controller('api/church')
export class ChurchController {

    constructor(private readonly churchService: ChurchService, superintendenceService: SuperintendenceService) {}

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
            async getChurchByCode(
                @Param('code') code : string): Promise<Church> {
                    const church = await this.churchService.findByCode(code)
                    if(!church) throw new NotFoundException({statusCode: 404, message: "Church Not Found"})
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
                const churches = await this.churchService.findAll();
                return churches
            }


        /*SUPERINTENDENCE*/

        @Get('superintendence/:churchId')
        async getSuperintendence(
            @Param('churchId') churchId : string): Promise<Church> {
                const church = await this.churchService.findSuperintendenceChurch(churchId)
                if(!church) throw new NotFoundException({statusCode: 404, message: "Superintendence Not Found"})
                return church
            }

        @Patch('superintendence/:churchId/:superintendenceId')
        @UsePipes(ValidationPipe)
        async updateSuperintendenceChurch(
              @Param('churchId', ChurchValidationExistPipe) churchId: string, 
              @Param('superintendenceId', SuperintendenceValidationExistPipe) superintendenceId: string, 
              ): Promise<void>{
                   await this.churchService.updateSuperintendence(churchId, superintendenceId)
            }

        @Delete('superintendence/:churchId')
        @UsePipes(ValidationPipe)
        async deleteSuperintendenceChurch(
            @Param('churchId', ChurchValidationExistPipe) churchId: string,  
            ): Promise<void>{
                 await this.churchService.deleteSuperintendenceChurch(churchId)
          }



          /**BOARD */


        @Post('board/:churchId/:presidentId/:leaderId')
        async createBoard(
            @Param('churchId', ChurchValidationExistPipe) churchId : string,
            @Param('presidentId', WorkerValidationExistPipe) presidentId : string,
            @Param('leaderId', WorkerValidationExistPipe) leaderId : string,
            @Body() data: CreateBoardDTO
            ): Promise<void> {
                const board = await this.churchService.createChurchBoard(churchId, presidentId, leaderId, data)
               
            }

        @Put('board/:boardId/:churchId/:presidentId/:leaderId')
            async updateBoard(
                @Param('boardId', BoardValidationExistPipe) boardId : string,
                @Param('churchId', ChurchValidationExistPipe) churchId : string,
                @Param('presidentId', WorkerValidationExistPipe) presidentId : string,
                @Param('leaderId', WorkerValidationExistPipe) leaderId : string,
                @Body() data: UpdateBoardDTO
                ): Promise<void> {
                    const board = await this.churchService.updateChurchBoard(boardId, churchId, presidentId, leaderId, data)
                   
                }

        @Delete('board/:boardId')
        @UsePipes(ValidationPipe)
        async deleteBoardChurch(
            @Param('boardId', BoardValidationExistPipe) boardId: string,  
            ): Promise<void>{
                 await this.churchService.deleteBoard(boardId)
          }

        /*HEADQUARTER*/



        @Patch('headquarter/:churchId/:headquarterId')
        @UsePipes(ValidationPipe)
        async updateHeadquarterChurch(
                @Param('churchId', ChurchValidationExistPipe) churchId: string, 
              @Param('headquarterId', ChurchValidationExistPipe) headquarterId: string,  
              ): Promise<void>{
                   await this.churchService.updateHeadquarterChurch(churchId,headquarterId)
            }


        @Delete('headquarter/:churchId')
        @UsePipes(ValidationPipe)
        async deleteHeadquarterChurch(
            @Param('churchId', ChurchValidationExistPipe) churchId: string
          ): Promise<void>{
               await this.churchService.deleteHeadquarterChurch(churchId)
        }




        /*CHURCH ANNOTATIONS*/



    @Post('annotations/:churchId')
    @UsePipes(ValidationPipe)
    async createAnnotationForChurch(
          @Param('churchId', ChurchValidationExistPipe) churchId: string,
          @Body() data: CreateChurchAnnotationDTO
    ): Promise<void>{
               await this.churchService.createAnnotationForChurch(churchId, data)
        }

    @Put('annotations/:idAnnotation')
    @UsePipes(ValidationPipe)
    async updateAnnotationForChurch(
          @Param('idAnnotation', ChurchAnnotationValidationExistPipe) idAnnotation: string,
          @Body() data: UpdateChurchAnnotationDTO
    ): Promise<void>{
               await this.churchService.updateAnnotationForChurch(idAnnotation, data)
        }
    
    @Delete('annotations/:idAnnotation')
    @UsePipes(ValidationPipe)
    async deleteAnnotationForChurch(
          @Param('idAnnotation', ChurchAnnotationValidationExistPipe) idAnnotation: string
    ): Promise<void>{
               await this.churchService.deleteAnnotationForChurch(idAnnotation)
        }


}
