
import * as express from "express";
import multer from "multer";
import { GetStorage } from "../../utility/uploader";
import { GetBaisInfo } from "../admin/controller/admin.basicInfo.controller";
import { GetAllDevelopers, GetDevelopersById } from '../admin/controller/admin.developers.controller';
import { GetAllBanners, GetBannerByID } from "../admin/controller/admin.banner.controller";
import { GetAbout } from "../admin/controller/admin.about.controller";
import { GetOurProduct } from "../admin/controller/admin.ourProduct.controller";
import { getAllFaq } from "../admin/controller/admin.faq.controller";

import {InsertContact} from "../admin/controller/admin.contact.controller";
import { ValidateGetBannerById, ValidateDeveloperId } from "./public.validator";
import { ValidateInsertContact } from "./public.validator";

class Public {
    public router: express.Router;
    private upload = multer({ storage: GetStorage() });
    constructor() {
        this.router = express.Router();
        this.configRoutes();
    }

    private configRoutes() {

        // Basic Info Routes
        this.router.get('/basic-info', [], GetBaisInfo);

        // Banner Routes
        this.router.get('/banner', [], GetAllBanners);
        this.router.get('/banner/:id', [...ValidateGetBannerById], GetBannerByID);

        // About Routes
        this.router.get('/about', GetAbout);

        // Oru Product Routes
        this.router.get('/our-product',GetOurProduct)

        // Developers Routes
        this.router.get('/developers', [], GetAllDevelopers);
        this.router.get('/developers/:id', [...ValidateDeveloperId], GetDevelopersById);

        // Faq Routes
        this.router.get('/faq', [], getAllFaq);

        //Contacts Routes

        this.router.post('/contact',[],[this.upload.array('contact'),...ValidateInsertContact],InsertContact);



    }
}

const PublicRouter = new Public().router;
export { PublicRouter };
