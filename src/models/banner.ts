import db from '../models/db';
import { Banner } from '../interfaces/';
import { Tables } from '../configs/table.config';

export class BannerDataDB {

    constructor() {

    }

    public static getAllBannerData(): Promise<Array<Banner>> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.BANNER}.id, ${Tables.BANNER}.name, ${Tables.USER}.name as createdBy, ${Tables.BANNER}.updatedBy
                      FROM ${Tables.BANNER}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.BANNER}.createdBy
                      `, (err, res) => {
                if (err) {
                    return reject(err)
                }
                if (res.length) {
                    return resolve(res.map((result: any) => Object.assign({}, result)));
                }
                return resolve(null);
            });
        });
    }

    public static getBannerDataById(id: string): Promise<Banner> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.BANNER}.id, ${Tables.BANNER}.name, ${Tables.USER}.name as createdBy, ${Tables.BANNER}.updatedBy
                      FROM ${Tables.BANNER}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.BANNER}.createdBy WHERE ${Tables.BANNER}.id=${id}
                      `, (err, res) => {
                if (err) {
                    return reject(err)
                }
                if (res.length) {
                    return resolve(res.map((result: any) => Object.assign({}, result))[0]);
                }
                return resolve(null);
            });
        });
    }

    public static insertBannerData(name: string, createdBy: string): Promise<string> {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${Tables.BANNER} (name, createdBy) VALUES ('${name}', '${createdBy}')`, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res.insertId)
            });
        });
    }

    public static updateBannerDataById(id: string, name: string): Promise<Banner> {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.BANNER} SET name=? WHERE id=${id}`, [name], (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(null);
            });
        });
    }
}