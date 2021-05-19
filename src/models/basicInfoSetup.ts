import db from './db';
import { BasicInfo } from '../interfaces';
import { Tables } from '../configs/table.config';

export class BasicInfoSetupDB {
    constructor() {

    }
    public static getBasicInfo(): Promise<BasicInfo> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.BASIC_INFO}.id, ${Tables.BASIC_INFO}.name, ${Tables.BASIC_INFO}.email, ${Tables.BASIC_INFO}.phone, ${Tables.USER}.name as createdBy, ${Tables.BASIC_INFO}.updatedBy
                      FROM ${Tables.BASIC_INFO}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.BASIC_INFO}.createdBy
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

    public static updateBasicInfo(name: string, email: string, phone: string): Promise<string> {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.BASIC_INFO} SET name=?, email=?, phone=? WHERE id=1`, [name, email, phone], (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(null);
            });
        });
    }
}