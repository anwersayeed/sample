import { checkSchema } from "express-validator";
import { DevelopersDataDB } from "../../../../src/models/developers";
import { ValidationResponder } from "../../../middleware";

import { ValidateAndDeleteFile } from "./admin.master.validator";

class AdminDeveloperValidator {
    constructor() { }


    public static validateInsertDeveloper() {
        return [
            ...checkSchema({
                name: {
                    in: ['body'],
                    exists: true,
                    errorMessage: 'Name is missing',
                },
                description: {
                    in: ['body'],
                    exists: true,
                    errorMessage: 'Description is missing',
                },
                designation: {
                    in: ['body'],
                    exists: true,
                    errorMessage: 'Designation is missing',
                },
            }),
            /* Add ValidateAndDeleteFile function if there is a file upload else not required */
   ValidateAndDeleteFile,
            ValidationResponder.fieldValidationResponder(),
        ];
    }

}
const ValidateAdminInsertDeveloper = AdminDeveloperValidator.validateInsertDeveloper();

export {
    ValidateAdminInsertDeveloper
}
