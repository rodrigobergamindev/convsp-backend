
import {
    Prisma, Worker
  } from '@prisma/client';
import { IsNotEmpty, IsOptional} from 'class-validator'


export class UpdateWorkerAnnotationDTO implements Prisma.WorkerAnnotationUpdateInput {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly content: string;

}