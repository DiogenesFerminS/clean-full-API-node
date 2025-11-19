import { Router } from "express";
import { CategoryController } from "./controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { CategoryService } from "../services/category.service.js";

const categoryService = new CategoryService();

const controller = new CategoryController(categoryService);

export class CategoryRoutes {

  static get routes(): Router {

    const router = Router();
    router.post('/', [AuthMiddleware.validateJWT] ,controller.createCategory)
    router.get('/', controller.getCategories)

    return router;
  }


}