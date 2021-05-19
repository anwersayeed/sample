import { AdminRouter, PublicRouter } from './routes'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import logger from 'morgan';
import express, { NextFunction, Response, Request } from 'express';
import MasterTables from './database/createTablesAndInsertMasterData';
const dotenv = require('dotenv');
dotenv.config();

class App {
  public app: express.Application;
  public apiV1Routes: express.Router;

  constructor() {
    this.app = express();
    this.apiV1Routes = express.Router();
    this.initializeMiddlewares();
    this.initializeLogger();
    this.initializeErrorHandling();
    this.routes();
  }

  public listen() {
    this.app.listen(process.env.SERVER_PORT, () => {
      console.log(`App listening on the port ${process.env.SERVER_PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, '../uploads')));
    this.app.use(logger('[:date[web]] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));
  }

  private initializeErrorHandling() {

  }

  private initializeLogger() {
    const LOG_PREFIX = new Date().getDate() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    const log = console.log;
    console.log = function () {
      const args = Array.from(arguments);
      args.unshift(LOG_PREFIX + ": ");
      log.apply(console, args);
    }
  }


  public async createDefaultTables() {
    try {
      console.log(`Creating Admin User Table and Super Admin User...`);
      await MasterTables.createUserTableAndSuperAdmin();

      console.log(`Creating Files Table ...`);
      await MasterTables.createFilesTable();

      console.log(`Create Basic Info Setup Table and Insert default info from ./data/BasicInfo.json ...`);
      await MasterTables.createBasicInfoTableAndInfos();

      console.log(`Creating Developers Table ...`);
      await MasterTables.createDevelopersTable();

      console.log(`Create Banner Table ...`);
      await MasterTables.createBannerTable();

      console.log(`Creating About Table ...`);
      await MasterTables.createAboutTableAndAbout();

      console.log(`Creating OUR_PRODUCT Table ...`);
      await MasterTables.createOurProductTableAndOurProduct();

      console.log(`Creating Faq Table ...`);
      await MasterTables.createFaqTable();

      console.log(`Creating Contact Table ...`);
      await MasterTables.createContactTable();

    } catch (error) {
      throw new Error(error);
    }
  }

  private routes() {
    this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.send('Brix Yoga');
    });
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    this.app.use('/api/v1', this.apiV1Routes);
    this.apiV1Routes.use('/', PublicRouter);
    this.apiV1Routes.use('/admin', AdminRouter);
  }
}

export default App;