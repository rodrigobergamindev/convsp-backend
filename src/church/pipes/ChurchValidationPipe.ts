import { ArgumentMetadata, BadRequestException, PipeTransform, NotFoundException, Injectable } from "@nestjs/common";
import { ChurchService } from "../service/church.service"; 



@Injectable()
export class ChurchValidationExistPipe implements PipeTransform {

    constructor(private readonly churchService: ChurchService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }
       
        const churchExist = await this.churchService.findById(value)
        if(!churchExist) throw new NotFoundException({statusCode: 400, message: "Igreja não encontrada"})
        
        return value

    }
    
}


@Injectable()
export class ChurchValidationAlreadyExistPipe implements PipeTransform {

    constructor(private readonly churchService: ChurchService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }
       
        const churchExist = await this.churchService.findByCode(value.code)

        if(churchExist) throw new BadRequestException({statusCode: 404, message: "Igreja já existe"})
            
        return value

    }
}


/*ANNOTATIONS*/

@Injectable()
export class ChurchAnnotationValidationExist implements PipeTransform {

    constructor(private readonly churchService: ChurchService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }

        const annotationExist = await this.churchService.findAnnotationById(value)
        if(!annotationExist) throw new NotFoundException({statusCode: 400, message: "Anotação não encontrada"})
        
        return value

    }
}