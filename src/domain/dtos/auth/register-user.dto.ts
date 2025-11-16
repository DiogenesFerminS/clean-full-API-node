import { regularExps } from "../../../config/regularExps.js";

export class RegisterUserDto {
    private constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
    ){}

    static create(object: {[key:string]: any}): [string?, RegisterUserDto? ] {

        if(object === undefined ) return ['Body empty'];

        const {name, email, password} = object;

        if(!name) return ['Missing name'];
        if(!email) return ['Missing email'];
        if(!regularExps.email.test(email)) return ['Invalid Email']
        if(!password) return ['Missing password'];
        if(password.length < 6) return ['Password too short']


        return [undefined, new RegisterUserDto(name, email, password)]
    }
}