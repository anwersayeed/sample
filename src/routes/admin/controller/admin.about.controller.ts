import { Response, NextFunction } from 'express';
import { FilesDB } from '../../../models/files';
import { AuthenticatedRequest, ResponseObject, About, UploadFile } from '../../../interfaces';
import { AboutDataDB } from '../../../models/about';

class AdminAboutController {
    constructor() {

    }

    public static getAbout = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<About>
        try {
            const about = await AboutDataDB.getAbout();
            const files = await FilesDB.getFiles('about', 1);
            about.image = files && files.length ? files[0].path : null;
            response = {
                ResponseData: about,
                ResponseMessage: 'About Info Fetched',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updateAbout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const aboutContent = req.body.content;
        const updatedBy = req.body.updatedBy || req.user.id.toString();
        let response: ResponseObject<any>;
        try {
            await AboutDataDB.UpdateAbout(aboutContent, updatedBy);
            response = {
                ResponseData: null,
                ResponseMessage: 'About Updated'
            }
        } catch (error) {
            console.log(error)
            return res.status(500).end();
        }
        
        const files: Array<UploadFile> = req.files;
        if (!files || !files.length) {
            return res.send(response);
        }
        const mappedFiles = files.map(file => {
            file['referenceId'] = '1';
            return file;
        });

        try {
            const files = await FilesDB.getFiles(`about`, 1);
            if (!files) {
                await FilesDB.insertFiles(mappedFiles);
            }
            await FilesDB.updateFiles(mappedFiles, null, 1, `about`);
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

}

const GetAbout = AdminAboutController.getAbout;
const UpdateAbout = AdminAboutController.updateAbout;

export {
    GetAbout,
    UpdateAbout,
}