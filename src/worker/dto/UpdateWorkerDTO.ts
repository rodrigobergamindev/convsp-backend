import { IsEmail, IsNotEmpty, IsPhoneNumber, IsUrl, IsOptional, IsArray } from 'class-validator';

import {
    Prisma, Role, Status
  } from '@prisma/client';



export class UpdateWorkerDTO implements Prisma.WorkerUpdateInput {

  
    @IsNotEmpty()
    readonly code: string;
  
    @IsUrl()
    @IsOptional()
    readonly photo?: string;
  
    @IsNotEmpty()
    readonly status: Status;
  
    @IsNotEmpty()
    readonly name: string;
  
    @IsNotEmpty()
    readonly role: Role;
  
    @IsNotEmpty()
    readonly rg: string;
  
    @IsNotEmpty()
    readonly cpf: string;
  
    @IsNotEmpty()
    readonly birth: Date;
  
    @IsOptional()
    readonly consagration: Date;
  
    @IsOptional()
    @IsPhoneNumber('BR')
    readonly phoneNumber: string;
  
    @IsOptional()
    @IsEmail()
    readonly email: string;
  
    @IsArray()
    readonly documentsUrl?: string[];
}