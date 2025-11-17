import { Router } from 'express';
import { AuthController } from './controller.js';
import { AuthService } from '../services/auth.service.js';
import { EmailService } from '../services/email.service.js';
import { envs } from '../../config/envs.js';

const {MAILER_EMAIL, MAILER_SECRET_KEY, MAILER_SERVICE, SEND_EMAIL} = envs;

const emailService = new EmailService(MAILER_SERVICE, MAILER_EMAIL, MAILER_SECRET_KEY, SEND_EMAIL);

const authService = new AuthService(emailService);

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

