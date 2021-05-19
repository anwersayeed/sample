import { checkSchema } from "express-validator";
import { ValidationResponder } from "../../../middleware";
import {ValidateAndDeleteFile} from "./admin.master.validator";
import { BannerDataDB } from "../../../../src/models/banner";

class AdminBannerValidator {
    constructor() {}

    public static validateAdminBanner() {
        return [
            ...checkSchema({
                name: {
                    in: ['body'],
                    isString: true,
                    exists: true,
                    errorMessage: 'Name is missing',
                },
            }),
            /* Add ValidateAndDeleteFile function if there is a file upload else not required */
            ValidateAndDeleteFile,          
            ValidationResponder.fieldValidationResponder(),
        ];
    }

    public static validateAdminBannerById() {
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
                                    const result = await BannerDataDB.getBannerDataById(value);
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
            ValidateAndDeleteFile,          
            ValidationResponder.fieldValidationResponder(),
        ];
    }

}
const ValidateAdminBanner = AdminBannerValidator.validateAdminBanner();
const ValidateAdminBannerById = AdminBannerValidator.validateAdminBannerById();


export {
    ValidateAdminBanner,
    ValidateAdminBannerById,
}