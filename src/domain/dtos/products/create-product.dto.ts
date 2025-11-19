import { Validators } from "../../../config/validators.js";

export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,
        public readonly category: string,
    ) { }

    static create(object: {[key: string]: any}): [string?, CreateProductDto?] {

        const {name, available, price, description, user, category} = object;

        let availableBoolean = available
        
        if( !name ) return ['Missing name'];

        if( !user ) return ['Missing user'];

        if( !category ) return ['Missing category'];

        if(typeof available !== 'boolean') {
            availableBoolean = (available === 'true')
        }

        if(!Validators.isMongoId(user)) return ['Invalid user id'];

        if(!Validators.isMongoId(category)) return ['Invalid category id'];

        return [
            undefined,
            new CreateProductDto(
                name,
                availableBoolean,
                price,
                description,
                user,
                category,
            )
        ];

    }
}