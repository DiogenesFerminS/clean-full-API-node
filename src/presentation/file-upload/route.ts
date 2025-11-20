import { Router } from "express";
import { UploadFileController } from "./controller.js";
import { FileUploadService } from "../services/file-upload.service.js";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware.js";
import { TypeMiddleware } from "../middlewares/type.middleware.js";

const fileuploadService = new FileUploadService();
const controller = new UploadFileController(fileuploadService);

export class UploadFileRoutes {
   static get routes(): Router {
    const router = Router();

    router.use(FileUploadMiddleware.containFiles);
    router.use(TypeMiddleware.verifyType([ 'users', 'categories', 'products' ]));

    router.post('/single/:type',controller.uploadFile)
    router.post('/multiple/:type', controller.uploadMultipleFile);

    return router
   } 
}