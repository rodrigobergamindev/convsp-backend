
import {
    Prisma, Role, Status,
  } from '@prisma/client';



export class CreateChurchDTO implements Prisma.ChurchCreateInput {

    readonly code: string;

    readonly photo?: string;

    readonly status?: Status;


 
}