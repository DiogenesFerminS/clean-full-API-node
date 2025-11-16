import { BcryptAdapter, JwtAdapter } from "../../config/index.js";
import { UserModel } from "../../data/index.js";
import { UserEntity } from "../../domain/entities/user.entity.js";
import { CustomError, RegisterUserDto, LoginUserDto } from "../../domain/index.js";

export class AuthService {
    constructor() {}

    public async registerUser(registeUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({email: registeUserDto.email});

        if(existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registeUserDto);
            user.password = BcryptAdapter.hash(registeUserDto.password);

            await user.save();

            const {password, ...rest} = UserEntity.fromObject(user);

            return {
                user: {
                    ...rest
                },
                token: '123'
            };
            
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const {email, password:password_dto} = loginUserDto;

        const user = await UserModel.findOne({email});

        if(!user) {
            throw CustomError.forbidden('Invalid credentials (email)');
        };

        const isValid = BcryptAdapter.compare(password_dto, user.password);

        if(!isValid) {
            throw CustomError.forbidden('Invalid credentials (password)');
        };

        const {password, ...rest} = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({id: user.id});
        if (!token) throw CustomError.internalServer('Error while creating JWT');

        return {
            user: {
                ...rest
            },
            token
        }
    }
}