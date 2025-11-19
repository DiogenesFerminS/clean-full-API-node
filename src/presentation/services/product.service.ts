import { ProductModel } from "../../data/index.js";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain/index.js";

export class ProductService {
    constructor() {}

    createProduct = async (createProductDto: CreateProductDto) => {
        const productExist = await ProductModel.findOne({name: createProductDto.name});

        if(productExist) {
            throw CustomError.badRequest('Product already exists');
        }

        try {
            const product = new ProductModel(createProductDto);
            await product.save();

            return product
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    getAllProducts = async (paginationDto: PaginationDto) => {
        const { limit, page } = paginationDto;

        try {
          const [total, products] = await Promise.all([
            ProductModel.countDocuments(),
            ProductModel.find()
              .skip((page - 1) * limit)
              .limit(limit)
              .populate('user')
              .populate('category')
          ]);

          return {
            page,
            limit,
            total,
            next: `/api/products?page=${page + 1}&limit=${limit}`,
            prev:
              page - 1 > 0
                ? `/api/products?page=${page - 1}&limit=${limit}`
                : null,
            products,
          };
        } catch (error) {
          throw CustomError.internalServer("Server internal error");
        }
    }
}