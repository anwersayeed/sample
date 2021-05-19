import * as express from "express";
import multer from 'multer';
import { LoadAuthorizedUser, ValidateBasicAuth, ValidateBearerToken, LoadAuthorization } from "../../middleware/common.middleware";
import { GetStorage } from "../../utility/uploader";
import { LoginByUserIdAndPassword } from "./admin.controller";
import { UpdateBasicInfo } from "./controller/admin.basicInfo.controller";
import { InsertDeveloper, DeleteDeveloperById, UpdateDeveloperById } from './controller/admin.developers.controller';
import { InsertBanner, UpdateBanner } from "./controller/admin.banner.controller";
import { UpdateAbout } from "./controller/admin.about.controller";
import { UpdateOurProduct } from "./controller/admin.ourProduct.controller";
import { InsertFaq } from "./controller/admin.faq.controller";
import { DeleteFaqById } from "./controller/admin.faq.controller";
import { GetAllContact } from "./controller/admin.contact.controller";
import { GetContactById } from "./controller/admin.contact.controller";
import { ValidateAdminBasicInfoUpdate } from "./validator/admin.basic-info.validator";
import {ValidateAdminBanner} from "./validator/admin.banner.validator";
import {ValidateAdminFaq} from "./validator/admin.faq.validator";
import {ValidateAdminBannerById} from "./validator/admin.banner.validator";
import { ValidateAdminInsertDeveloper } from "./validator/admin.developers.validator";
import { ValidateAdminGetContactById } from "./validator/admin.contact.validator";
import {ValidateDeveloperId} from './../public/public.validator'
import { ValidateAdminOurProductUpdate } from "./validator/admin.ourProduct.validator";
class AdminRouting {
    public router: express.Router;
    private upload = multer({ storage: GetStorage() });
    constructor() {
        this.router = express.Router();
        this.configRoutes();
    }

    private configRoutes() {

        // Authentication Routes
        this.router.get('/authentication', [...ValidateBasicAuth, ...LoadAuthorization], LoginByUserIdAndPassword);

        // Basic Info Routes
        this.router.post('/basic-info', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.array('basic-info', 1), ...ValidateAdminBasicInfoUpdate], UpdateBasicInfo);

        // Banner Routes
        this.router.post('/banner', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.array('banner', 1),...ValidateAdminBanner], InsertBanner);
        this.router.post('/banner/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.array('banner', 1),...ValidateAdminBannerById], UpdateBanner);

        // About Routes
        this.router.post('/about', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], this.upload.array('about', 1), UpdateAbout);

        // Developers Routes
        this.router.post('/developers', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.array('developers', 1), ...ValidateAdminInsertDeveloper], InsertDeveloper);
        this.router.post('/developers/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.array('developers', 1), ...ValidateDeveloperId], UpdateDeveloperById);
        this.router.delete('/developers/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, ...ValidateDeveloperId], DeleteDeveloperById);

        // FAQ Routes
        this.router.post('/faq', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser,this.upload.array('faq'),...ValidateAdminFaq], InsertFaq);
        this.router.delete('/faq/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], DeleteFaqById);

        //contact router
        this.router.get('/contact',[...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser],this.upload.array('contact',1),GetAllContact);
        this.router.get('/contact/:id',[...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser,this.upload.array('contact',1),...ValidateAdminGetContactById],GetContactById);

        //Our Product router
        this.router.post('/our-product', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.array('our-product', 1),...ValidateAdminOurProductUpdate],UpdateOurProduct );
    }
}

const AdminRouter = new AdminRouting().router;

export {
    AdminRouter
}
