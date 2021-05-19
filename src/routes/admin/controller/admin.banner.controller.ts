import { Response, NextFunction } from 'express';
import { FilesDB } from '../../../models/files';
import { AuthenticatedRequest, ResponseObject, Banner, UploadFile } from '../../../interfaces';
import { BannerDataDB } from '../../../models/banner';

class AdminBlogController {
    constructor() {

    }

    public static getAllBanners = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<Banner | Banner[]>;
        try {
            const allBanners = await BannerDataDB.getAllBannerData();
            const allFiles = await FilesDB.getAllFiles();
            if (allBanners && allBanners.length) {
                allBanners.map(banner => allFiles.map(file => file['referenceId'] == banner.id && file['fieldname'] == 'banner' ? banner.image = file.path : null));
            }
            response = {
                ResponseData: allBanners,
                ResponseMessage: 'Banner List Fetched',
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static getBannerByID = async (req: AuthenticatedRequest, res: Response) => {
        const bannerID = req.params.id;
        let response: ResponseObject<Banner>;
        try {
            const banner = await BannerDataDB.getBannerDataById(bannerID);
            const files = await FilesDB.getFiles(`banner`, Number(bannerID));
            banner.image = files && files.length ? files[0].path : null;
            response = {
                ResponseData: banner,
                ResponseMessage: 'Banner Details Fetched',
            }
        } catch (error) {
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static insertBanner = async (req: AuthenticatedRequest, res: Response) => {
        const name = req.body.name;
        const createdBy = req.body.createdBy || req.user.id.toString();
        let insertedID: string;
        let response: ResponseObject<any>;
        try {
            insertedID = await BannerDataDB.insertBannerData(name, createdBy);
            response = {
                ResponseData: null,
                ResponseMessage: `Banner Inserted`
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        const files: Array<UploadFile> = req.files;

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

    public static updateBanner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const bannerID = req.params.id;
        const name = req.body.name;
        const updatedBy = req.body.updatedBy || req.user.id.toString();
        let response: ResponseObject<any>;
        try {
            await BannerDataDB.updateBannerDataById(bannerID, name);
            response = {
                ResponseData: null,
                ResponseMessage: 'Banner Updated'
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        const files: Array<UploadFile> = req.files;
        if (!files || !files.length) {
            return res.send(response);
        }
        const mappedFiles = files.map(file => {
            file['referenceId'] = bannerID;
            return file;
        });

        try {
            await FilesDB.updateFiles(mappedFiles, null, bannerID, `banner`);
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }
}

const InsertBanner = AdminBlogController.insertBanner;
const UpdateBanner = AdminBlogController.updateBanner;
const GetAllBanners = AdminBlogController.getAllBanners;
const GetBannerByID = AdminBlogController.getBannerByID

export {
    InsertBanner,
    UpdateBanner,
    GetAllBanners,
    GetBannerByID
}