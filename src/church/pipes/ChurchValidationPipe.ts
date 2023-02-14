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
export class ChurchAnnotationValidationExistPipe implements PipeTransform {

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

/*BOARD*/

@Injectable()
export class BoardValidationExistPipe implements PipeTransform {

    constructor(private readonly churchService: ChurchService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }

        const boardExist = await this.churchService.findBoardById(value)
        if(!boardExist) throw new NotFoundException({statusCode: 400, message: "Diretoria não encontrada"})
        
        return value

    }
}


/*ADDRESS*/
@Injectable()
export class ChurchAddressValidationExistPipe implements PipeTransform {

    constructor(private readonly churchService: ChurchService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }

        const addressExist = await this.churchService.findChurchAddress(value)
        if(!addressExist) throw new NotFoundException({statusCode: 400, message: "Endereço não encontrado"})
        
        return value

    }
}