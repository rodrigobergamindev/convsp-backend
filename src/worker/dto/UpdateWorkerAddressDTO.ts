
import {
    Prisma, Worker
  } from '@prisma/client';
import { IsNotEmpty, IsOptional} from 'class-validator'


export class UpdateWorkerAddressDTO implements Prisma.WorkerAddressUpdateInput {


  @IsNotEmpty()
  readonly type: string;

  @IsNotEmpty()
  readonly place: string;

  @IsNotEmpty()
  readonly number: string;

  @IsOptional()
  readonly complement?: string;

  @IsNotEmpty()
  readonly district: string;

  @IsNotEmpty()
  readonly city: string;

  @IsNotEmpty()
  readonly state: string;

  @IsNotEmpty()
  readonly zip_code: string;

  @IsNotEmpty()
  readonly worker: Prisma.WorkerCreateNestedOneWithoutAddressInput;

}