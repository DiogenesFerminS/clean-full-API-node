import { Request, Response } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ImagesController {

    constructor() {}

    getImage = (req: Request, res: Response) => {
        const {type = '', image = ''} = req.params;

        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${image}`);

        if(!fs.existsSync(imagePath)) {
            return res.status(404).send('Image not found');
        };

        res.sendFile(imagePath);
    }
    

}