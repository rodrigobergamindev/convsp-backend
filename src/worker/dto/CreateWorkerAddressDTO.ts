
import {
    Prisma, Worker
  } from '@prisma/client';
import { IsNotEmpty, IsOptional} from 'class-validator'


export class CreateWorkerAddressDTO implements Prisma.WorkerAddressCreateInput {

  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly type: string;

  @IsNotEmpty()
  readonly place: string;

  @IsNotEmpty()
  readonly number: string;

  @IsOptional()
  readonly complement: string;

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