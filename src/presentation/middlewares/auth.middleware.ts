import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter.js";
import { UserModel } from "../../data/index.js";
import { UserEntity } from "../../domain/entities/user.entity.js";

export class AuthMiddleware {
    static async validateJWT(req:Request, res: Response, next: NextFunction) {

        const authorization = req.header('Authorization');
        if(!authorization) return res.status(401).json({error: 'No token provided'});
        if(!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Invalid Bearer token'});

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = JwtAdapter.validateToken<{ id: string }>(token);

            if(!payload) return res.status(401).json({error: 'Invalid Token'});

            const user = await UserModel.findById(payload.id);

            if(!user) return res.status(401).json({error: 'Invalid Token'});

            req.body.user = UserEntity.fromObject(user);

            next();
            
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Internal server error'});
        }

    }
}