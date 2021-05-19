import { checkSchema } from "express-validator";
import { ValidationResponder } from "../../../middleware";


class AdminFaqValidator {
    constructor() {}

    public static validateAdminFaq() {
        return [
            ...checkSchema({
                question: {
                    in: ['body'],
                    isString: true,
                    exists: true,
                    errorMessage: 'Question is missing',
                },
                answer: {
                    in: ['body'],
                    isString: true,
                    exists: true,
                    errorMessage: 'Answer is missing',
                },
            }),       
            ValidationResponder.fieldValidationResponder(),
        ];
    }
}
const ValidateAdminFaq = AdminFaqValidator.validateAdminFaq();

export {
    ValidateAdminFaq,
}