import { NextFunction, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { AuthenticatedRequest, UploadFile } from "../../../interfaces";
import { ValidationResponder } from "../../../middleware";
import fs from 'fs';

class AdminValidator {
    constructor() { }

    public static validateAdminFileDelete() {
        return [
            ...checkSchema({
                id: {
                    in: ['params'],
                    exists: true,
                    isInt: true,
                    errorMessage: 'File id is incorrect',
                },
            }),
            ValidationResponder.fieldValidationResponder(),
        ];
    }

    public static validateAndDeleteFile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const uploadedFiles: Array<UploadFile> = req.files;
            uploadedFiles.map(file => {
                fs.unlink(file.path, err => {
                    console.log(err);
                })
            })
            return next();
        } else {
            return next();
        }
    }
}

const ValidateAndDeleteFile = AdminValidator.validateAndDeleteFile;


export {
    ValidateAndDeleteFile,
}