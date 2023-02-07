
import {
    Prisma, Role, Situacao, Templo,
  } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsUrl } from 'class-validator';



export class UpdateChurchDTO implements Prisma.ChurchUpdateInput {

    @IsNotEmpty()
    readonly code: string;

    @IsOptional()
    readonly situacao?: Situacao;

    @IsNotEmpty()
    readonly name: string;

    @IsOptional()
    readonly cnpj?: string;

    @IsOptional()
    readonly templo?: Templo;

    @IsOptional()
    @IsNumber()
    readonly membros?: number;
 
    @IsNotEmpty()
    readonly address: Prisma.ChurchAddressCreateNestedOneWithoutChurchInput;

    @IsPhoneNumber('BR')
    readonly phoneNumber?: string;

    @IsEmail()
    readonly email?: string;

    @IsOptional()
    readonly annotations?: Prisma.ChurchAnnotationCreateNestedManyWithoutChurchInput;
    
    @IsOptional()
    readonly superintendence: Prisma.SuperintendenceCreateNestedOneWithoutChurchInput;

    @IsOptional()
    readonly workers?: Prisma.WorkerCreateNestedManyWithoutChurchInput;

    @IsOptional()
    readonly board?: Prisma.BoardCreateNestedOneWithoutChurchInput;

    @IsOptional()
    readonly headquarter?: Prisma.ChurchCreateNestedOneWithoutCongregationsInput;

    @IsOptional()
    readonly congregations?: Prisma.ChurchCreateNestedManyWithoutHeadquarterInput;

     
 
}