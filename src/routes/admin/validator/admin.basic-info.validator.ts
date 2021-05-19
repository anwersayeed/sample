import { checkSchema } from "express-validator";
import { ValidationResponder } from "../../../middleware";
import {ValidateAndDeleteFile} from "./admin.master.validator";

class AdminBasicInfoValidator {
    constructor() {}

    public static validateAdminBasicInfoUpdate() {
        return [
            ...checkSchema({
                name: {
                    in: ['body'],
                    exists: true,
                    errorMessage: 'Name is missing',
                },
                email: {
                    in: ['body'],
                    exists: true,
                    errorMessage: 'Email is missing',
                },
                phone: {
                    in: ['body'],
                    exists: true,
                    errorMessage: 'Phone Number is missing',
                },
            }),
            /* Add ValidateAndDeleteFile function if there is a file upload else not required */
            ValidateAndDeleteFile,          
            ValidationResponder.fieldValidationResponder(),
        ];
    }
}
const ValidateAdminBasicInfoUpdate = AdminBasicInfoValidator.validateAdminBasicInfoUpdate();

export {
    ValidateAdminBasicInfoUpdate,
}