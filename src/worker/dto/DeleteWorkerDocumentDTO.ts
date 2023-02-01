
import {
    Prisma, Role, Status,
  } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsUrl } from 'class-validator'



export class DeleteWorkerDocumentDTO {

  @IsNotEmpty()
  readonly key: string;

}