import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";


export class CreateSuperintendenceDTO implements Prisma.SuperintendenceCreateInput {

    @IsNotEmpty()
    readonly name;

    @IsNotEmpty()
    readonly region;

    @IsNotEmpty()
    readonly superintendent: Prisma.WorkerCreateNestedOneWithoutSuperintendenceInput;

    @IsNotEmpty()
    readonly matriz: Prisma.ChurchCreateNestedOneWithoutMatrizInput;
  }