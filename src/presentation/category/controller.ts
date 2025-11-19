import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain/index.js";
import { CategoryService } from "../services/category.service.js";

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message});
        }

        console.log(`${error}`);
        return res.status(500).json({error: 'Internal Server Error'});
    }

    createCategory = (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

        if(error) {
            return res.status(400).json({error});
        }

        this.categoryService.createCategory(createCategoryDto, req.body.user)
        .then((resp) => res.status(200).json(resp))
        .catch((err) => this.handleError(err, res));
    }

    getCategories = (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;

        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if(error){
            return res.status(400).json(error);
        }

        this.categoryService.getAllCategories(paginationDto)
        .then((resp) => res.status(200).json(resp)) 
        .catch((error) => this.handleError(error, res));

    }
}    