import { CategoryModel } from "../../data/index.js";
import { UserEntity } from "../../domain/entities/user.entity.js";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain/index.js";

export class CategoryService {
    constructor() {}

    async createCategory(createCategoryDto:CreateCategoryDto, user:UserEntity) {
        const categoryExists = await CategoryModel.findOne({name: createCategoryDto.name});

        if(categoryExists) throw CustomError.badRequest('Category already exists');

        try {
            
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id,
            });

            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }

        } catch (error) {
            throw CustomError.internalServer('Server internal error');
        }
    }

    async getAllCategories(paginationDto: PaginationDto) {
        
        const { limit, page } = paginationDto;

        try {

            const [total, categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                .skip((page - 1) * limit)
                .limit(limit)
            ])

            const catEntities = categories.map((cat) => {
              return {
                id: cat.id,
                name: cat.name,
                available: cat.available,
              };
            });

            return {
                page,
                limit,
                total,
                next: `/api/categories?page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/categories?page=${page - 1}&limit=${limit}` : null,
                categories:catEntities 
            };
        } catch (error) {
            throw CustomError.internalServer('Server internal error');
        }
    }
}