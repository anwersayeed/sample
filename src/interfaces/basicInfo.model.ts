import { UploadFile } from "./files.model";

interface BasicInfo {
    id: number | string,
    name: string,
    email: string,
    phone: string,
    createdBy: string,
    updatedBy: string,
    updatedOn: Date,
    files?: Array<UploadFile>,
    logo: string,
    
}

export {
    BasicInfo,
}