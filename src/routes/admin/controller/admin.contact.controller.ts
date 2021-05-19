import { Response } from 'express';
import { ContactDB } from './../../../models/contact';
import { AuthenticatedRequest, ResponseObject, UploadFile, Contact } from '../../../interfaces';
import { FilesDB } from '../../../models/files';

class ContactController {
    constructor() {

    }
    public static getAllContact = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<Contact | Contact[]>
        try {
            const allContact = await ContactDB.getAllContact();
            response = {
                ResponseData: allContact,
                ResponseMessage: 'All Contacts Fetched',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static getContactById = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<Contact>
        const id = req.params.id;

        try {
            const contact = await ContactDB.getContactById(id)
            // console.log(contact);
            // const file = await FilesDB.getFiles('contact', Number(id))
            response = {
                ResponseData: contact,
                ResponseMessage: 'Contact Fetched',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static insertContact = async (req: AuthenticatedRequest, res: Response) => {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone_no;
        const message = req.body.message;
        let insertedID: string;
        let response: ResponseObject<any>;
        try {
            insertedID = await ContactDB.insertContact(name,email,phone,message);
            response = {
                ResponseData: null,
                ResponseMessage: 'Contact Inserted',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const GetAllContact = ContactController.getAllContact;
const GetContactById = ContactController.getContactById;
const InsertContact = ContactController.insertContact;

export {
    GetAllContact,
    GetContactById,
    InsertContact,
}