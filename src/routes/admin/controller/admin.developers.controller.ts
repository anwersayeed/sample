import { Response } from 'express';
import { DevelopersDataDB } from './../../../models/developers';
import { AuthenticatedRequest, ResponseObject, UploadFile, Developers } from '../../../interfaces';
import { FilesDB } from '../../../models/files';

class DeveloperController {
    constructor() {

    }
    public static getAllDevelopersData = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<Developers | Developers[]>
        try {
            const allDevelopers = await DevelopersDataDB.getAllDevelopersData();
            const allFiles = await FilesDB.getAllFiles();
            if (allDevelopers && allDevelopers.length) {
                allDevelopers.map(developer => allFiles.map(file => (developer.id == file['referenceId'] && "developers" == file['fieldname']) ? developer.image = file.path : null));
            }
            response = {
                ResponseData: allDevelopers || [],
                ResponseMessage: 'Developers Data Fetched',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static getDevelopersDataById = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<Developers | Developers[]>
        const id = req.params.id;

        try {
            const developer = await DevelopersDataDB.getDevelopersDataById(id)
            const file = await FilesDB.getFiles('developers', id)
            developer.image = file && file.length ? file[0].path: null;
            response = {
                ResponseData: developer,
                ResponseMessage: 'Developers Data Fetched',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }


    public static insertDevelopersData = async (req: AuthenticatedRequest, res: Response) => {
        const name = req.body.name;
        const description = req.body.description;
        const designation = req.body.designation;
        const githubLink = req.body.githubLink || '';
        const linkedInLink = req.body.linkedInLink  || '';

        const createdBy = req.body.createdBy || req.user.id.toString();
        let insertedID: string;
        let response: ResponseObject<any>;
        try {
            insertedID = await DevelopersDataDB.insertDevelopersData(name, description, createdBy,designation,githubLink,linkedInLink);
            response = {
                ResponseData: null,
                ResponseMessage: 'Developer Inserted',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        const files: Array<UploadFile> = req.files;
        if (!files || !files.length) {
            return res.send(response);
        }
        const mappedFiles = files.map(file => {
            file['referenceId'] = insertedID;
            return file;
        });

        try {
            await FilesDB.insertFiles(mappedFiles);
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updateDeveloperById = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<any>
        const id = req.params.id;
        const name = req.body.name;
        const description = req.body.description;
        const designation = req.body.designation;
        const githubLink = req.body.githubLink || '';
        const linkedInLink = req.body.linkedInLink  || '';
        const updatedBy = req.body.updatedBy || req.user.id.toString();
        try {
            await DevelopersDataDB.updateDevelopersDataById(id, name, description, updatedBy,designation,githubLink,linkedInLink);
            response = {
                ResponseData: null,
                ResponseMessage: 'Developer Updated'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        if (!req.files || !req.files.length) {
            return res.send(response);
        }
        const files: Array<UploadFile> = req.files;
        const mappedFiles = files.map(file => {
            file['referenceId'] = id;
            return file;
        });

        try {
            const files = await FilesDB.getFiles(`developers`, id)
            if(!files) {
                await FilesDB.insertFiles(mappedFiles);
            }
            await FilesDB.updateFiles(mappedFiles, null, id, 'developers');
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);

    }

    public static deleteDeveloperById = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<any>
        const id = req.params.id;
        try {
            await DevelopersDataDB.deleteDevelopersDataById(id);
            await FilesDB.deleteFile(id, 'developers');
            response = {
                ResponseData: null,
                ResponseMessage: 'Developer Deleted'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);

    }

}

const GetAllDevelopers = DeveloperController.getAllDevelopersData;
const GetDevelopersById = DeveloperController.getDevelopersDataById;
const InsertDeveloper = DeveloperController.insertDevelopersData;
const DeleteDeveloperById = DeveloperController.deleteDeveloperById;
const UpdateDeveloperById = DeveloperController.updateDeveloperById;

export {
    GetAllDevelopers,
    GetDevelopersById,
    InsertDeveloper,
    UpdateDeveloperById,
    DeleteDeveloperById,
}