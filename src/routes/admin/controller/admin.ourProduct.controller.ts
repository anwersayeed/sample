import { OurProductDataDB } from './../../../models/ourProduct';
import { Response, NextFunction } from 'express';
import { FilesDB } from '../../../models/files';
import { AuthenticatedRequest, ResponseObject, About, UploadFile } from '../../../interfaces';


class AdminAboutController {
    constructor() {

    }

    public static getOurProduct = async (req: AuthenticatedRequest, res: Response) => {
        let response: ResponseObject<About>
        try {
            const OurProduct = await OurProductDataDB.getOurProduct()
            const files = await FilesDB.getFiles('our-product', 1);
            OurProduct.image = files && files.length ? files[0].path : null;
            response = {
                ResponseData: OurProduct,
                ResponseMessage: 'Our Product Fetched',
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

    public static updateOurProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const OurProductContent = req.body.content;
        const updatedBy = req.body.updatedBy || req.user.id.toString();
        let response: ResponseObject<any>;
        try {
            await OurProductDataDB.UpdateOurProduct(OurProductContent, updatedBy);
            response = {
                ResponseData: null,
                ResponseMessage: 'Our Product Updated'
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
            const files = await FilesDB.getFiles(`our-product`, 1);
            if (!files) {
                await FilesDB.insertFiles(mappedFiles);
            }
            await FilesDB.updateFiles(mappedFiles, null, 1, `our-product`);
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        return res.send(response);
    }

}

const GetOurProduct = AdminAboutController.getOurProduct;
const UpdateOurProduct = AdminAboutController.updateOurProduct;

export {
    GetOurProduct,
    UpdateOurProduct,
}