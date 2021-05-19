import { UploadFile } from "./files.model";

interface About {
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
    About,
}