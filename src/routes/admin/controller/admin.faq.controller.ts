import { Response, NextFunction } from 'express';
import { FilesDB } from '../../../models/files';
import { AuthenticatedRequest, ResponseObject, Faq, UploadFile } from '../../../interfaces';
import { FaqDataDB } from '../../../models/faq';

class AdminFaqController {
    constructor() {

    }

    public static getAllFaq = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<Faq | Faq[]>;
        try {
            const allFaq = await FaqDataDB.getAllFaqData();
            response = {
                ResponseData: allFaq,
                ResponseMessage: 'Faq List Fetched',
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static insertFaq = async (req: AuthenticatedRequest, res: Response) => {
        const question = req.body.question;
        const answer = req.body.answer;
        const createdBy = req.body.createdBy || req.user.id.toString();
        let insertedID: string;
        let response: ResponseObject<any>;
        try {
            insertedID = await FaqDataDB.insertFaqData(question, answer, createdBy);
            response = {
                ResponseData: null,
                ResponseMessage: `Faq Inserted`
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static deleteFaqById = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<any>
        const id = req.params.id;
        try {
            await FaqDataDB.deleteFaqDataById(id);
            response = {
                ResponseData: null,
                ResponseMessage: 'Faq Deleted'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);

    }
}

const InsertFaq = AdminFaqController.insertFaq;
const DeleteFaqById = AdminFaqController.deleteFaqById;
const getAllFaq = AdminFaqController.getAllFaq;

export {
    InsertFaq,
    DeleteFaqById,
    getAllFaq
}