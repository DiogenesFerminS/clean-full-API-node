import { envs } from "../../config/envs.js"
import { CategoryModel } from "../mongo/models/category.model.js";
import { ProductModel } from "../mongo/models/product.model.js";
import { UserModel } from "../mongo/models/user.model.js";
import { MongoDatabase } from "../mongo/mongo-database.js"
import { seedData } from "./data.js";

(async() => {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    await main();

    await MongoDatabase.disconnect();
})();

const randomBetween0AndX = (x: number) => {
    return Math.floor( Math.random() * x );
}

async function main() {
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()
    ]);

    const users = await UserModel.insertMany(seedData.users);

    const categories = await CategoryModel.insertMany(
        seedData.categories.map((cat) => ({
            ...cat,
            user: users[0]._id,
        }))
    );

    const product = await ProductModel.insertMany(
        seedData.products.map((product) => ({
            ...product,
            user: users[randomBetween0AndX(seedData.users.length)]._id,
            category: categories[randomBetween0AndX(seedData.categories.length)]._id
        }))
    )

    console.log('Seed Executed');
}