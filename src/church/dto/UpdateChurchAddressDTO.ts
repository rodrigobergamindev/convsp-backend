
import {
    Prisma
  } from '@prisma/client';
import { IsNotEmpty, IsOptional} from 'class-validator'


export class UpdateChurchAddressDTO implements Prisma.ChurchAddressUpdateInput {

  @IsNotEmpty()
  readonly type: string;

  @IsNotEmpty()
  readonly place: string;

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

 
  readonly church: Prisma.ChurchUpdateOneRequiredWithoutAddressNestedInput;

}