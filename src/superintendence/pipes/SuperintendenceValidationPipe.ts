import { ArgumentMetadata, BadRequestException, PipeTransform, NotFoundException, Injectable } from "@nestjs/common";
import { SuperintendenceService } from "../service/superintendence.service"; 



@Injectable()
export class SuperintendenceValidationExistPipe implements PipeTransform {

    constructor(private readonly superintendenceService: SuperintendenceService){}

    async transform(value: any, metadata: ArgumentMetadata) {
        
        if(!value){
            
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }
       
        const superintendenceExist = await this.superintendenceService.findById(value)
        if(!superintendenceExist) throw new NotFoundException({statusCode: 400, message: "Superintendência não encontrada"})
        
        return value

    }
    
}


@Injectable()
export class SuperintendenceValidationAlreadyExistPipe implements PipeTransform {

    constructor(private readonly superintendenceService: SuperintendenceService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }
        
        
        const superintendenceExist = await this.superintendenceService.findByName(value.name)

        if(superintendenceExist) throw new BadRequestException({statusCode: 404, message: "Superintendência já existe"})
            
        return value

    }
}