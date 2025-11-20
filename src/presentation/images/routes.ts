import { Router } from "express";
import { ImagesController } from "./controller.js";

const controller = new ImagesController();
export class ImageRoutes {
    static get routes(): Router {
        const router = Router();

        router.get('/:type/:image', controller.getImage);

        return router;
    }
}