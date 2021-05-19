import { checkSchema } from "express-validator";
import { ValidationResponder } from "../../../middleware";
import {ValidateAndDeleteFile} from "./admin.master.validator";

class AdminOurProductValidator {
    constructor() {}

    public static validateAdminOurProductUpdate() {
        return [
            ...checkSchema({
                content: {
                    in: ['body'],
                    exists: true,
                    errorMessage: 'Content is missing',
                },
            }),
            /* Add ValidateAndDeleteFile function if there is a file upload else not required */
            ValidateAndDeleteFile,          
            ValidationResponder.fieldValidationResponder(),
        ];
    }
}
const ValidateAdminOurProductUpdate = AdminOurProductValidator.validateAdminOurProductUpdate();

export {
    ValidateAdminOurProductUpdate,
}