import jwt from 'jsonwebtoken';
import { envs } from './envs.js';

const JWT_SECRET = envs.JWT_SECRET;

export class JwtAdapter {

  static async generateToken(payload:any, durantion: number = 7200) {
    try {
        const token = jwt.sign(payload,JWT_SECRET, {
            expiresIn:durantion,
        })

        return token;
    } catch (error) {
        console.error(error);
        return null;
    };
  }

  static validateToken(token: string) {

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      return null
    }
    
  }
}