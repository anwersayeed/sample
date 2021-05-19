

import { checkSchema } from "express-validator";
import { Banner } from "../../interfaces";
import { Contact } from "../../interfaces";
import { Tables } from "../../configs/table.config";
import { BannerDataDB } from '../../models/banner';
import db from '../../models/db';
import { ValidationResponder } from "../../middleware";
import { DevelopersDataDB } from "../../models/developers";


class PublicValidator {
    constructor() { }

    public static validateGetBannerById() {
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
                                    const bannerData = await BannerDataDB.getBannerDataById(value);
                                    if (bannerData != null) {
                                        return resolve(true);
                                    }
                                    else {
                                        return reject(false);
                                    }
                                });
                        },
                        errorMessage: 'Id not found',
                    },
                    errorMessage: 'Invalid Id',

                },
            }),
            ValidationResponder.fieldValidationResponder(),
        ];
    }
    public static validateDeveloperId() {
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
                                    const developerData = await DevelopersDataDB.getDevelopersDataById(value);
                                    if (developerData != null) {
                                        return resolve(true);
                                    }
                                    else {
                                        return reject(false);
                                    }
                                });
                        },
                        errorMessage: 'Id not found',
                    },
                    errorMessage: 'Invalid Id',

                },
            }),
            ValidationResponder.fieldValidationResponder(),
        ];
    }
    
    public static validateInsertContact() {
        return [
            ...checkSchema({
                name: {
                    in: ['body'],
                    isString: true,
                    exists: true,
                    errorMessage: 'Name is missing',
                },
                email: {
                    in: ['body'],
                    isEmail: true,
                    exists: true,
                    errorMessage: 'Email is missing',
                },
                phone_no: {
                    in: ['body'],
                    isNumeric: true,
                    exists: true,
                    errorMessage: 'Phone Number is missing',
                },
                message: {
                    in: ['body'],
                    isString: true,
                    exists: true,
                    errorMessage: 'message is missing',
                },
            }),
            /* Add ValidateAndDeleteFile function if there is a file upload else not required */
            // ValidateAndDeleteFile,          
            ValidationResponder.fieldValidationResponder(),
        ];
    }

}

const ValidateGetBannerById = PublicValidator.validateGetBannerById();
const ValidateDeveloperId = PublicValidator.validateDeveloperId();
const ValidateInsertContact = PublicValidator.validateInsertContact();

export {
    ValidateGetBannerById,
    ValidateDeveloperId,
    ValidateInsertContact,

}


