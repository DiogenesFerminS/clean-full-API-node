import { envs } from "../../config/envs.js";
import { BcryptAdapter, JwtAdapter } from "../../config/index.js";
import { UserModel } from "../../data/index.js";
import { UserEntity } from "../../domain/entities/user.entity.js";
import { CustomError, RegisterUserDto, LoginUserDto } from "../../domain/index.js";
import { EmailService } from "./email.service.js";

const WEBSERVICE_URL = envs.WEBSERVICE_URL;

export class AuthService {
    constructor(
        private readonly emailService: EmailService
    ) {}

    public async registerUser(registeUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({email: registeUserDto.email});

        if(existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registeUserDto);
            user.password = BcryptAdapter.hash(registeUserDto.password);

            await user.save();

            await this.sendEmailValidationLink(user.email);

            const {password, ...rest} = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToken({id: user.id});
            if (!token) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: {
                    ...rest
                },
                token,
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

    public async validateEmail(token: string) {
        const payload = JwtAdapter.validateToken(token);

        if(!payload) throw CustomError.unauthorized('Access denied, invalid token');

        const {email} = payload as { email:string };
        if(!email) throw CustomError.badRequest('Email not in token');

        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.internalServer('Email not exists');

        user.emailValidated = true;

        await user.save();

        return true;
    }


    private async sendEmailValidationLink(email: string) {
        const token = await JwtAdapter.generateToken({email}, 900);
        if(!token) throw CustomError.internalServer('Error getting token');

        const link = `${WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
            <h1>Validate your email on User-Store</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${link}">Validate</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        };

        const isSent = await this.emailService.sendEmail(options);
        if ( !isSent ) throw CustomError.internalServer('Error sending email');

        return true;
    }
}