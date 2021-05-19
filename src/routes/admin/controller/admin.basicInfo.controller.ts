import { Response, Request } from 'express';
import { BasicInfoSetupDB } from '../../../models/basicInfoSetup';
import { AuthenticatedRequest, BasicInfo, ResponseObject, UploadFile } from '../../../interfaces';
import { FilesDB } from '../../../models/files';

class AdminBasicInfoSetupController {
    constructor() {

    }

    public static getBasicInfo = async (req: Request, res: Response) => {
        let response: ResponseObject<BasicInfo>
        try {
            const basicInfo = await BasicInfoSetupDB.getBasicInfo();
            const files = await FilesDB.getFiles('basic-info', 1);
            basicInfo.logo = files && files.length ? files[0].path : null;
            response = {
                ResponseData: basicInfo,
                ResponseMessage: 'Basic Info Fetched',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updateBasicInfo = async (req: AuthenticatedRequest, res: Response) => {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        let response: ResponseObject<any>;
        try {
            await BasicInfoSetupDB.updateBasicInfo(name, email, phone);
            response = {
                ResponseData: null,
                ResponseMessage: 'Basic Info Updated',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        if (!req.files || !req.files.length){
            return res.send(response);
        }

        const files: Array<UploadFile> = req.files;
        const mappedFiles = files.map(file => {
            file['referenceId'] = '1';
            return file;
        });

        try {
            const files = await FilesDB.getFiles('basic-info', 1);
            if(!files)
            {
                await FilesDB.insertFiles(mappedFiles);
            }
            await FilesDB.updateFiles(mappedFiles, null, 1, 'basic-info');
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const GetBaisInfo = AdminBasicInfoSetupController.getBasicInfo;
const UpdateBasicInfo = AdminBasicInfoSetupController.updateBasicInfo;

export {
    GetBaisInfo,
    UpdateBasicInfo,
}