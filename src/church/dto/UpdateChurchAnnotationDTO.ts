import { Prisma } from "@prisma/client";
import { IsNotEmpty } from "class-validator";


export class UpdateChurchAnnotationDTO implements Prisma.ChurchAnnotationUpdateInput {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly content: string;


   
    readonly church: Prisma.ChurchUpdateOneWithoutWorkersNestedInput;
  }