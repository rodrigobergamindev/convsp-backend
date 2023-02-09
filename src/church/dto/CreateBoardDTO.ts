import { Prisma } from "@prisma/client";
import { IsNotEmpty } from "class-validator";


export class CreateBoardDTO implements Prisma.BoardCreateInput {

   @IsNotEmpty()
   readonly validity: string;

   @IsNotEmpty()
   readonly church: Prisma.ChurchCreateNestedOneWithoutBoardInput;

   @IsNotEmpty()
   readonly president: Prisma.WorkerCreateNestedOneWithoutPresidentInput;

   @IsNotEmpty()
   readonly leader: Prisma.WorkerCreateNestedOneWithoutLeaderInput;
  }
