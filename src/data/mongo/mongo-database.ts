import mongoose from "mongoose";

interface Options {
    dbName: string;
    mongoUrl: string;
}

export class MongoDatabase {
    static async connect(options: Options) {
        const {dbName, mongoUrl} = options;

        try {
            await mongoose.connect(mongoUrl, {
                dbName: dbName,
            })
            console.log('Connected')
            return true;
        } catch (error) {
            console.log('Mongo connection error');
            throw error
        }
    }

    static async disconnect() {
        await mongoose.disconnect();
    }
}