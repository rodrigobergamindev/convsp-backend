import { Prisma } from "@prisma/client";
import { IsNotEmpty } from "class-validator";


export class CreateChurchAnnotationDTO implements Prisma.ChurchAnnotationCreateInput {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly content: string;

    readonly church: Prisma.ChurchCreateNestedOneWithoutAnnotationsInput;
  }