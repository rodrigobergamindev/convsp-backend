import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";


export class UpdateSuperintendenceDTO implements Prisma.SuperintendenceUpdateInput {

    @IsNotEmpty()
    readonly name;

    @IsNotEmpty()
    readonly region;

   
  }