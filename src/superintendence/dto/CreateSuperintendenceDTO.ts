import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";


export class CreateSuperintendenceDTO implements Prisma.SuperintendenceCreateInput {

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly region: string;

  }