import { checkSchema } from "express-validator";
import { ValidationResponder } from "../../../middleware";
import { ContactDB } from '../../../models/contact';

class ContactValidator {
    constructor() {}

    public static validateAdminGetContactById() {
        return [
            ...checkSchema({
                id: {
                    in: ['params'],
                    exists: true,
                    isInt: true,
                    custom: {
                        options: (value: string) => {
                            if (Number.isInteger(+value))
                                return new Promise(async (resolve, reject) => {
                                    const result = await ContactDB.getContactById(value);
                                    if (result != null) {
                                        return resolve(true);
                                    }
                                    else {
                                        return reject(false);
                                    }
                                });
                        },
                        errorMessage: 'Id not found',
                    },
                    errorMessage: 'Id is missing',

                },
            }),
            /* Add ValidateAndDeleteFile function if there is a file upload else not required */
            // ValidateAndDeleteFile,          
            ValidationResponder.fieldValidationResponder(),
        ];
    }
}
const ValidateAdminGetContactById = ContactValidator.validateAdminGetContactById();

export {
    ValidateAdminGetContactById,
}