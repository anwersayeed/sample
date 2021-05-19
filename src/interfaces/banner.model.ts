import { UploadFile } from "./files.model";

interface Banner {
    id: number | string,
    name: string,
    createdBy: string,
    updatedBy: string,
    updatedOn: Date,
    files?: Array<UploadFile>,
    image?: string,
}

export {
    Banner,
}