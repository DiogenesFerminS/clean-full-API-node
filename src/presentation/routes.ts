import { Router } from 'express';
import { AuthRoutes } from './auth/routes.js';
import { CategoryRoutes } from './category/routes.js';
import { ProductsRoutes } from './product/routes.js';
import { UploadFileRoutes } from './file-upload/route.js';
import { ImageRoutes } from './images/routes.js';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/category', CategoryRoutes.routes);
    router.use('/api/products', ProductsRoutes.routes);
    router.use('/api/upload', UploadFileRoutes.routes);
    router.use('/api/images', ImageRoutes.routes);

    return router;
  }


}

