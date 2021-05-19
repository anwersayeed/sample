import { UploadFile } from "./files.model";

interface Faq {
    id: number | string,
    question: string,
    answer: string,
    createdBy: string, 
    createdOn: Date,   
}

export {
    Faq,
}