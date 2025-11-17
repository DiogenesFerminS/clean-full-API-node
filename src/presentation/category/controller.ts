import { Request, Response } from "express";
import { CreateCategoryDto, CustomError } from "../../domain/index.js";

export class CategoryController {
    constructor() {}

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

        res.status(200).json(createCategoryDto);
    }

    getCategories = (req: Request, res: Response) => {
        res.status(200).json('Get Categories');
    }
}    