import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";


export class UpdateSuperintendenceDTO implements Prisma.SuperintendenceUpdateInput {

    @IsNotEmpty()
    readonly name;

    @IsNotEmpty()
    readonly region;

    @IsNotEmpty()
    readonly superintendent: Prisma.WorkerUpdateOneRequiredWithoutSuperintendenceNestedInput;

    @IsNotEmpty()
    readonly matriz: Prisma.ChurchUpdateOneRequiredWithoutMatrizNestedInput;
  }