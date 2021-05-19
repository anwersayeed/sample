import {UploadFile} from "./files.model";

interface Contact {
    id: number | string,
    name: string,
    email:string,
    phone_no: number,
    message: string,
    createdOn: Date,
}
export {
    Contact,
}