import { UploadFile } from "./files.model";

interface OurProduct {
    id: number | string,
    content: string,
    createdBy: string,
    updatedBY?: string,
    createdOn: string,
    updatedOn?: string,
    files?: Array<UploadFile>,
    image: string,
}

export {
    OurProduct,
}