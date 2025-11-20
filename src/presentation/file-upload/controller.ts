import { Request, Response } from "express";
import { CustomError } from "../../domain/index.js";
import { FileUploadService } from "../services/file-upload.service.js";
import { UploadedFile } from "express-fileupload";

export class UploadFileController {

    constructor(
        private readonly fileUploadService: FileUploadService
    ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  };

  uploadFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const validTypes = ['users', 'categories', 'products'];

    if(!validTypes.includes(type)) {
        return res.status(400).json({error: `Invalid types: ${type}, valid ones ${validTypes}`});
    };

    const file = req.body.files.at(0) as UploadedFile;

    this.fileUploadService.uploadSingle(file, `uploads/${type}`)
    .then((resp) => res.json(resp))
    .catch( error => this.handleError(error, res));

  };

  uploadMultipleFile = (req: Request, res: Response) => {
    const {type} = req.params;
    const files = req.body.files as UploadedFile[];

    this.fileUploadService.uploadMultiple(files, `uploads/${type}`)
    .then((resp) => res.json(resp))
    .catch( error => this.handleError(error, res));
  }
}