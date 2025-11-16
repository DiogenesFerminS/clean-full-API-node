import { Router } from 'express';
import { AuthController } from './controller.js';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

const controller = new AuthController(authService);
export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);

    router.get('/validate-email/:token', controller.validateEmail);

    return router;
  }


}

