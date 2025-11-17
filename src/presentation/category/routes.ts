import { Router } from "express";
import { CategoryController } from "./controller.js";

const controller = new CategoryController();

export class CategoryRoutes {

  static get routes(): Router {

    const router = Router();
    router.post('/', controller.createCategory)
    router.get('/', controller.getCategories)

    return router;
  }


}