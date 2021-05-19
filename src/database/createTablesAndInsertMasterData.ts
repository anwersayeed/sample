import db from '../models/db';
import { Encryption } from '../utility/encryption';
import { Tables } from '../configs/table.config';
import { ReadFile } from '../service/readWriteJson.service';
import { BasicInfo } from '../interfaces/basicInfo.model';
import { About } from '../interfaces/about.model';
import {OurProduct} from '../interfaces/ourProduct.model'


export default class CreateTablesAndInsertMasterData {

    constructor() {

    }

    // ADMIN USER TABLE
    private static createAdminUserTable(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.USER}(
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                role VARCHAR(100) NOT NULL,
                userId VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                createdOn DATETIME default current_timestamp,
                PRIMARY KEY(id),
                CONSTRAINT contacts_unique UNIQUE (userId))
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }

    private static createSuperAdminUser(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const user = {
                name: "Administrator",
                role: "SUPER_ADMIN",
                userId: "anwer",
                password: Encryption.encryptPassword(process.env.ADMIN_DEFAULT_PASSWORD),
            };

            db.query(`INSERT IGNORE INTO ${Tables.USER} SET ?`, user, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }

    public static async createUserTableAndSuperAdmin() {
        try {
            await CreateTablesAndInsertMasterData.createAdminUserTable();
        } catch (e) {
            console.error('CREATE USER TABLE', e);
        }

        try {
            await CreateTablesAndInsertMasterData.createSuperAdminUser();
        } catch (e) {
            console.error('CREATE SUPER ADMIN', e);
        }
    }

    // FILES TABLE
    public static async createFilesTable() {
        return new Promise((resolve, reject) => {
            // db.query(`DROP TABLE ${Tables.FILES}`);
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.FILES} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                fieldname VARCHAR(255),
                referenceId INT,
                originalname VARCHAR(255),
                encoding VARCHAR(255),
                mimetype VARCHAR(255),
                destination VARCHAR(255),
                filename VARCHAR(255),
                path VARCHAR(255),
                size INT,
                createdBy VARCHAR(255),
                updatedBy VARCHAR(255),
                createdOn DATETIME NOT NULL DEFAULT current_timestamp,                
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT contacts_unique UNIQUE (id))
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        })
    }

    // BASIC INFO TABLE
    private static createBasicInfoTable() {
        return new Promise((resolve, reject) => {
            // db.query(`DROP TABLE ${Tables.BASIC_INFO}`)
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.BASIC_INFO} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(30) NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                updatedBy VARCHAR(255),
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT contact_unique UNIQUE(name))
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }
    //Faq Table
    public static createFaqTable() {
        return new Promise((resolve, reject) => {
            // db.query(`DROP TABLE ${Tables.FAQ}`)
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.FAQ} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                question text NOT NULL,
                answer text NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                CONSTRAINT contact_unique UNIQUE(id))
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }

    private static constructDefaultBasicInfo(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let BasicInfo: Array<any> = [];
                const infos = await ReadFile<Array<BasicInfo>>('../../data/BasicInfo.json');
                infos.forEach((info, index, array) => {
                    BasicInfo.push({
                        name: info.name,
                        email: info.email,
                        phone: info.phone,
                        createdBy: '1',
                    });

                    if (array.length === index + 1) {
                        resolve(BasicInfo);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }

    private static insertDefaultBasicInfo() {
        return new Promise(async (resolve, reject) => {
            let BasicInfo: Array<any>;
            let keys: Array<any>;
            let values: Array<any>;

            BasicInfo = await CreateTablesAndInsertMasterData.constructDefaultBasicInfo();
            keys = Object.keys(BasicInfo[0]);
            values = BasicInfo.map(obj => keys.map(key => obj[key]));
            db.query(`INSERT IGNORE INTO ${Tables.BASIC_INFO} (${keys.join(',')}) VALUES ?`, [values], (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        })
    }

    public static async createBasicInfoTableAndInfos() {
        try {
            await CreateTablesAndInsertMasterData.createBasicInfoTable();
        } catch (e) {
            console.log('CREATE BASIC INFO SETUP TABLE', e);
        }

        try {
            await CreateTablesAndInsertMasterData.insertDefaultBasicInfo();
        } catch (e) {
            console.log('INSERT BASIC INFO', e);
        }
    }

    // DEVELOPERS TABLE
    public static createDevelopersTable() {
        return new Promise((resolve, reject) => {
            // db.query(`DROP TABLE ${Tables.DEVELOPERS}`)
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.DEVELOPERS} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                name VARCHAR(255) NOT NULL,
                description VARCHAR(255),
                designation VARCHAR(255),
                githubLink VARCHAR(255),
                linkedInLink VARCHAR(255),
                createdBy VARCHAR(255),
                updatedBy VARCHAR(255),
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT contact_unique UNIQUE(id))
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }
    
    //Contact Table
    public static createContactTable() {
        return new Promise((resolve, reject) => {
            //  db.query(`DROP TABLE ${Tables.CONTACT}`)
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.CONTACT} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(255) NOT NULL,
                message text NOT NULL,
                createdOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT contact_unique UNIQUE(id))
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }

    // BANNER TABLE
    public static createBannerTable() {
        return new Promise((resolve, reject) => {
            // db.query(`DROP TABLE ${Tables.BANNER}`)
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.BANNER} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                name VARCHAR(255) NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                updatedBy VARCHAR(255),
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT contact_unique UNIQUE(id))
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }

    //About TABLE
    private static createAboutTable() {
        return new Promise((resolve, reject) => {
            // db.query(`DROP TABLE ${Tables.ABOUT}`)
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.ABOUT} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                content VARCHAR(1000) NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                updatedBy VARCHAR(255),
                createdOn DATETIME NOT NULL DEFAULT current_timestamp,
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT contact_unique UNIQUE(createdBy))
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }

    private static constructDefaultAbout(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let AboutInfo: Array<any> = [];
                const infos = await ReadFile<Array<About>>('../../data/About.json');
                infos.forEach((info, index, array) => {
                    AboutInfo.push({
                        content: info.content,
                        createdBy: '1',
                    });

                    if (array.length === index + 1) {
                        resolve(AboutInfo);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }

    private static insertDefaultAbout() {
        return new Promise(async (resolve, reject) => {
            let AboutInfo: Array<any>;
            let keys: Array<any>;
            let values: Array<any>;

            AboutInfo = await CreateTablesAndInsertMasterData.constructDefaultAbout();
            keys = Object.keys(AboutInfo[0]);
            values = AboutInfo.map(obj => keys.map(key => obj[key]));

            db.query(`INSERT IGNORE INTO ${Tables.ABOUT} (${keys.join(',')}) VALUES ?`, [values], (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        })
    }

    public static async createAboutTableAndAbout() {
        try {
            await CreateTablesAndInsertMasterData.createAboutTable();
        } catch (e) {
            console.log('INSERT BASIC INFO', e);
        }

        try {
            await CreateTablesAndInsertMasterData.insertDefaultAbout();
        } catch (e) {
            console.log('INSERT BASIC INFO', e);
        }
    }


    
    //Oru Product TABLE
    private static createOurProductTable() {
        return new Promise((resolve, reject) => {
            // db.query(`DROP TABLE ${Tables.OUR_PRODUCT}`)
            db.query(`CREATE TABLE IF NOT EXISTS ${Tables.OUR_PRODUCT} (
                id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),
                content VARCHAR(1000) NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                updatedBy VARCHAR(255),
                createdOn DATETIME NOT NULL DEFAULT current_timestamp,
                updatedOn DATETIME NOT NULL DEFAULT current_timestamp,
                CONSTRAINT contact_unique UNIQUE(createdBy))
                `, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        });
    }

    private static constructDefaultOurProduct(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let OurProduct: Array<any> = [];
                const infos = await ReadFile<Array<OurProduct>>('../../data/OurProduct.json');
                infos.forEach((info, index, array) => {
                    OurProduct.push({
                        content: info.content,
                        createdBy: '1',
                    });

                    if (array.length === index + 1) {
                        resolve(OurProduct);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }

    private static insertDefaultOurProduct() {
        return new Promise(async (resolve, reject) => {
            let OurProduct: Array<any>;
            let keys: Array<any>;
            let values: Array<any>;

            OurProduct = await CreateTablesAndInsertMasterData.constructDefaultOurProduct();
            keys = Object.keys(OurProduct[0]);
            values = OurProduct.map(obj => keys.map(key => obj[key]));
            
            db.query(`INSERT IGNORE INTO ${Tables.OUR_PRODUCT} (${keys.join(',')}) VALUES ?`, [values], (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(true);
                }
                return resolve(null);
            });
        })
    }

    public static async createOurProductTableAndOurProduct() {
        try {
            await CreateTablesAndInsertMasterData.createOurProductTable();
        } catch (e) {
            console.log('INSERT OUR_PRODUCT', e);
        }

        try {
            await CreateTablesAndInsertMasterData.insertDefaultOurProduct();
        } catch (e) {
            console.log('INSERT DEFAULT OUR_PRODUCT DATA', e);
        }
    }
}


