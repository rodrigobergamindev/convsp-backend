
import { ArgumentMetadata, BadRequestException, PipeTransform, NotFoundException, Injectable } from "@nestjs/common";
import { WorkerService } from '../service/worker.service';

@Injectable()
export class WorkerValidationExistPipe implements PipeTransform {

    constructor(private readonly workerService: WorkerService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }
        
        const workerExist = await this.workerService.findById(value)
        if(!workerExist) throw new NotFoundException({statusCode: 400, message: "Obreiro não encontrado"})
        
        return value

    }
    
}

@Injectable()
export class WorkerValidationAlreadyExistPipe implements PipeTransform {

    constructor(private readonly workerService: WorkerService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }
       
        const workerExist = await this.workerService.findByCode(value.code)

        if(workerExist) throw new BadRequestException({statusCode: 404, message: "Obreiro já existe"})
            
        return value

    }
}



/*ANNOTATIONS*/

@Injectable()
export class WorkerAnnotationValidationExistPipe implements PipeTransform {

    constructor(private readonly workerService: WorkerService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }

        const annotationExist = await this.workerService.findAnnotationById(value)
        if(!annotationExist) throw new NotFoundException({statusCode: 400, message: "Anotação não encontrada"})
        
        return value

    }
}


/*ADDRESS*/
@Injectable()
export class WorkerAddressValidationExistPipe implements PipeTransform {

    constructor(private readonly workerService: WorkerService){}

    async transform(value: any, metadata: ArgumentMetadata) {
    
        if(!value){
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado`)
        }

        const addressExist = await this.workerService.findWorkerAddress(value)
        if(!addressExist) throw new NotFoundException({statusCode: 400, message: "Endereço não encontrado"})
        
        return value

    }
}

