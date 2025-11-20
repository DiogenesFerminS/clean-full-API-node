import fs from "fs";
import path, { dirname } from "path";
import type { UploadedFile } from "express-fileupload";
import { fileURLToPath } from "url";
import { Uuid } from "../../config/uuid.adapter.js";
import { CustomError } from "../../domain/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class FileUploadService {
    constructor(
        private readonly uuid = Uuid.v4,
    ) {}

    private checkFolder(folderPath: string) {
        if( !fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    };

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {
        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? '';
            const destination = path.resolve(__dirname, '../../../', folder);

            if(!validExtensions.includes(fileExtension)) {
                throw CustomError.badRequest(`Invalid extension ${fileExtension}, valid ones ${validExtensions}`)
            }

            this.checkFolder(destination);
            const fileName = `${this.uuid()}.${fileExtension}`;

            file.mv(`${destination}/${fileName}`);
            return {fileName};
        } catch (error) {
            console.log(error);
        }

    }

    async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {

        const fileNames = await Promise.all(
            files.map(file => this.uploadSingle(file, folder, validExtensions))
        );
        
        return fileNames;
    }
}