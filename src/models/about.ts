import db from '../models/db';
import { About } from '../interfaces/';
import { Tables } from '../configs/table.config';

export class AboutDataDB {
    constructor() {

    }

    public static getAbout(): Promise<About> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.ABOUT}.id, ${Tables.ABOUT}.content,${Tables.USER}.name as createdBy, ${Tables.ABOUT}.updatedBy
                      FROM ${Tables.ABOUT}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.ABOUT}.createdBy WHERE ${Tables.ABOUT}.id=${'1'}
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

    public static UpdateAbout(content: string, updatedBy: string): Promise<About> {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.ABOUT} SET content=?, createdBy=? WHERE id=1`, [content, updatedBy], (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(null);
            });
        });
    }

}