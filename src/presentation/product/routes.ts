import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { ProductController } from "./controller.js";
import { ProductService } from "../services/product.service.js";

const productService = new ProductService();
const controller = new ProductController(productService);

export class ProductsRoutes {
    static get routes(): Router {
        const router = Router();
        router.post('/', [AuthMiddleware.validateJWT], controller.createProduct)
        router.get('/', controller.getProducts)

        return router
    }
}