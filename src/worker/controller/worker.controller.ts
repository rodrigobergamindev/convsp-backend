import { Controller, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put, Req, UploadedFiles, UsePipes } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Document, Worker } from '@prisma/client';
import { CreateWorkerDTO } from '../dto/CreateWorkerDTO';
import { UpdateWorkerChurchDTO } from '../dto/UpdateWorkerChurchDTO';
import { UpdateWorkerDTO } from '../dto/UpdateWorkerDTO';
import { WorkerValidationAlreadyExistPipe, WorkerValidationExistPipe } from '../pipes/WorkerValidationPipe';
import { WorkerService } from '../service/worker.service';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';


@Controller('api/workers')
export class WorkerController {

    constructor(private readonly workerService: WorkerService) {}

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
    
    
    /**POST */
 

    @Post(':id/fileUpload')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(
        @Param('id', WorkerValidationExistPipe) id: string,
        @UploadedFiles() files: Express.Multer.File[]): Promise<any> {
            await this.workerService.fileUpload(id, files);

    }

    @Delete(':id/deleteFiles')
    async deleteFile(
        @Param('id', WorkerValidationExistPipe) id: string, @Body() files: String[]): Promise<any> {
            await this.workerService.deleteFiles(id, files)

    }
         
    @Post()
    @UsePipes(ValidationPipe, WorkerValidationAlreadyExistPipe)
        async create(
            @Body() worker: CreateWorkerDTO): Promise<void>{
                await this.workerService.create(worker)
        }
    


        
    @Put(':id')
    @UsePipes(ValidationPipe)
    async update(
          @Param('id', WorkerValidationExistPipe) id: string, @Body() worker: UpdateWorkerDTO): Promise<void>{
               await this.workerService.update(id, worker)
        }
    
        
    @Delete(':id')
    async deleteUser(
        @Param('id', WorkerValidationExistPipe) id : string): Promise<void> {
          
            await this.workerService.delete(id)
        }
    
    @Put(':workerId/:churchId')
    @UsePipes(ValidationPipe)
        async updateChurch(
            @Param('userId', WorkerValidationExistPipe) userId: string, 
            @Body() churchId: UpdateWorkerChurchDTO
        ): Promise<void>{
            
            await this.workerService.updateWorkerChurch(userId, churchId)
      }  
}
