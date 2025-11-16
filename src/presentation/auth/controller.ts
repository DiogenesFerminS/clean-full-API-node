import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain/index.js";
import { AuthService } from "../services/auth.service.js";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto.js";

export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message});
        }

        console.log(`${error}`);
        return res.status(500).json({error: 'Internal Server Error'});
    }

    registerUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if(error) {
            return res.status(400).json({error});
        }

        this.authService.registerUser(registerUserDto)
        .then((resp) => res.status(200).json(resp))
        .catch((error) => this.handleError(error, res));
    };

    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);

        if(error) {
            return res.status(400).json(error);
        };

        this.authService.loginUser(loginUserDto)
        .then((resp) => res.status(200).json(resp))
        .catch((error) => this.handleError(error, res));
    };

    validateEmail = (req: Request, res: Response) => {
        res.status(200).json({message: 'Todo ok'});
    };
}