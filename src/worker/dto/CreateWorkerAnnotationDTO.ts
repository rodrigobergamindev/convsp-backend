
import {
    Prisma, Worker
  } from '@prisma/client';
import { IsNotEmpty, IsOptional} from 'class-validator'


export class CreateWorkerAnnotationDTO implements Prisma.WorkerAnnotationCreateInput {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly content: string;


    @IsNotEmpty()
    readonly worker: Prisma.WorkerCreateNestedOneWithoutAnnotationsInput;
}