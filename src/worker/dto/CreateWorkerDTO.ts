
import {
    Prisma, Role, Status,
  } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsUrl } from 'class-validator'



export class CreateWorkerDTO implements Prisma.WorkerCreateInput {

  @IsNotEmpty()
  readonly code: string;

  @IsUrl()
  @IsOptional()
  readonly photo?: string;

  @IsOptional()
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

  @IsOptional()
  readonly address?: Prisma.WorkerAddressCreateNestedManyWithoutWorkerInput;

  @IsOptional()
  readonly church?: Prisma.ChurchCreateNestedOneWithoutWorkersInput;
}