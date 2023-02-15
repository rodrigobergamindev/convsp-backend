import { Controller, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Body, Delete, Get, Param, Patch, Post, Put, Req, UploadedFiles, UsePipes } from '@nestjs/common/decorators';
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Document, Prisma, Worker, WorkerAddress } from '@prisma/client';
import { CreateWorkerDTO } from '../dto/CreateWorkerDTO';
import { UpdateWorkerDTO } from '../dto/UpdateWorkerDTO';
import { WorkerAddressValidationExistPipe, WorkerAnnotationValidationExistPipe, WorkerValidationAlreadyExistPipe, WorkerValidationExistPipe } from '../pipes/WorkerValidationPipe';
import { WorkerService } from '../service/worker.service';
import { FilesInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import { ChurchValidationExistPipe } from 'src/church/pipes/ChurchValidationPipe';
import { CreateWorkerAnnotationDTO } from '../dto/CreateWorkerAnnotationDTO';
import { CreateWorkerAddressDTO } from '../dto/CreateWorkerAddressDTO';
import { UpdateWorkerAddressDTO } from '../dto/UpdateWorkerAddressDTO';



@Controller('api/workers')
export class WorkerController {

    constructor(private readonly workerService: WorkerService) {}

    /*FIND*/

    @Get()
        async getWorkers(): Promise<Worker[]>{
            const workers = await this.workerService.findAll();
            return workers
        }
    
    @Get('id/:id')
        async getWorkerById(
            @Param('id') id : string): Promise<Worker> {
                const worker = await this.workerService.findById(id)
                if(!worker) throw new NotFoundException({statusCode: 404, message: "Worker Not Found"})
                return worker
            }  
       
    @Get('name/:name')
        async getWorkerByName(
            @Param('name') name : string): Promise<Worker[]> {
                const worker = await this.workerService.findByName(name)
                return worker
        }

    @Get('cpf/:cpf')
        async getWorkerByCpf(
            @Param('cpf') cpf : string): Promise<Worker> {
                const worker = await this.workerService.findByCPF(cpf)
                if(!worker) throw new NotFoundException({statusCode: 404, message: "Worker Not Found"})
                return worker
        }

    @Get('code/:code')
        async getWorkerByCode(
            @Param('code') code : string): Promise<Worker> {
                const worker = await this.workerService.findByCode(code)
                if(!worker) throw new NotFoundException({statusCode: 404, message: "Worker Not Found"})
                return worker
        }


    /*GENERATE CODE*/

    @Get('generateCode')
        async generateCode() {
                const code = await this.workerService.generateCode()
                if(!code) throw new NotFoundException({statusCode: 404, message: "Erro ao gerar código"})
                return code
        }

    
    
    
    /*UPLOAD AND DELETE FILES*/
 

    @Post(':id/fileUpload')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(
        @Param('id', WorkerValidationExistPipe) id: string,
        @UploadedFiles() files: Express.Multer.File[]): Promise<any> {
            await this.workerService.fileUpload(id, files);

    }

    @Delete(':id/deleteFiles')
    async deleteFile(
        @Param('id', WorkerValidationExistPipe) id: string, 
        @Body() files: string[]): Promise<any> {
            await this.workerService.deleteFiles(files)

    }
    
    /*CREATE WORKER*/
    @Post()
    @UsePipes(ValidationPipe, WorkerValidationAlreadyExistPipe)
        async create(
            @Body() data: CreateWorkerDTO): Promise<void>{

               return await this.workerService.create(data)

               
        }
    


    /*UPDATE WORKER*/
    @Put(':id')
    @UsePipes(ValidationPipe)
    async update(
          @Param('id', WorkerValidationExistPipe) id: string, 
          @Body() data: UpdateWorkerDTO): Promise<void>{
               await this.workerService.update(id, data)
        }
    
    
    /*DELETE WORKER*/
    @Delete(':id')
    async deleteUser(
        @Param('id', WorkerValidationExistPipe) id : string): Promise<void> {
          
            await this.workerService.delete(id)
        }
    
    
    /*CHURCH FOR WORKER*/

    @Patch(':id/:churchId')
    @UsePipes(ValidationPipe)
    async updateChurchForWorker(
          @Param('id', WorkerValidationExistPipe) id: string, 
          @Param('churchId', ChurchValidationExistPipe) churchId: string): Promise<void>{
               await this.workerService.updateChurchForWorker(id, churchId)
        }

    /*ANNOTATIONS*/ 
 
    @Post('annotations/:workerId')
    @UsePipes(ValidationPipe)
    async createAnnotationForWorker(
          @Param('workerId', WorkerValidationExistPipe) workerId: string,
          @Body() data: CreateWorkerAnnotationDTO 
    ): Promise<void>{
               await this.workerService.createAnnotationForWorker(workerId, data)
        }

    @Put('annotations/:idAnnotation')
    @UsePipes(ValidationPipe)
    async updateAnnotationForWorker(
          @Param('idAnnotation', WorkerAnnotationValidationExistPipe) idAnnotation: string,
          @Body() data: CreateWorkerAnnotationDTO 
    ): Promise<void>{
               await this.workerService.updateAnnotationForWorker(idAnnotation, data)
        }
    
    @Delete('annotations/:idAnnotation')
    @UsePipes(ValidationPipe)
    async deleteAnnotationForWorker(
          @Param('idAnnotation', WorkerAnnotationValidationExistPipe) idAnnotation: string
    ): Promise<void>{
               await this.workerService.deleteAnnotationForWorker(idAnnotation)
        }

    /*ADDRESS*/

    @Post('address/:workerId')
    @UsePipes(ValidationPipe)
    async createAddress(
          @Param('workerId', WorkerValidationExistPipe) workerId: string,
          @Body() data: CreateWorkerAddressDTO 
    ): Promise<void>{
               await this.workerService.createWorkerAddress(workerId, data)
        }



    @Put('address/:workerAddressId/:workerId')
    @UsePipes(ValidationPipe)
        async updateAddress(
              @Param('workerAddressId', WorkerAddressValidationExistPipe) workerAddressId: string,
              @Param('workerId', WorkerValidationExistPipe) workerId: string,
              @Body() data: UpdateWorkerAddressDTO 
        ): Promise<void>{
                   await this.workerService.updateWorkerAddress(workerAddressId, data)
            }

    @Get('address/:workerAddressId')
        async findWorkerAddress(
            @Param('workerAddressId') workerAddressId: string,
        ): Promise<WorkerAddress> {
            
                const workerAddress = await this.workerService.findWorkerAddress(workerAddressId)
                if(!workerAddress) throw new NotFoundException({statusCode: 404, message: "Worker Address Not Found"})
                return workerAddress
        }   

    /*
    @Post('payment')
    async payment(): Promise<any> {
        return await this.workerService.payment()
    }
        */
}
 