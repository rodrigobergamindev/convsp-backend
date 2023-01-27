import { IsNotEmpty } from "class-validator";


export class UpdateWorkerChurchDTO  {

    @IsNotEmpty()
    readonly code: string;

  
}