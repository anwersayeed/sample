import { UploadFile } from "./files.model";

interface Developers {
    id: number | string,
    name: string,
    description: string,
    designation: string,
    githubLink?: string,
    linkedInLink?: string,
    createdBy: string,
    updatedBy: string,
    updatedOn: Date,
    files?: Array<UploadFile>,
    image?: any,
}

export {
    Developers,
}