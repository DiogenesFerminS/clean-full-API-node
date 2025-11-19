import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain/index.js";
import { ProductService } from "../services/product.service.js";

export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message});
        }

        console.log(`${error}`);
        return res.status(500).json({error: 'Internal Server Error'});
    }

    createProduct = (req: Request, res: Response) => {

        const [error, createProductDto] = CreateProductDto.create({...req.body, user:req.body.user.id});

        if(error) {
            res.status(400).json(error);
        };

        this.productService.createProduct(createProductDto)
        .then((resp) => res.status(200).json(resp))
        .catch((error) => this.handleError(error, res))
    }

    getProducts = (req: Request, res: Response) => {
        const {page = 1, limit = 10} = req.query;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);

        if(error) {
            res.status(400).json(error);
        };

        this.productService.getAllProducts(paginationDto)
        .then((resp) => res.status(200).json(resp))
        .catch((error) => this.handleError(error, res))
    }

}