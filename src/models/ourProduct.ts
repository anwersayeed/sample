import db from '../models/db';
import { OurProduct } from '../interfaces/';
import { Tables } from '../configs/table.config';

export class OurProductDataDB {
    constructor() {

    }

    public static getOurProduct(): Promise<OurProduct> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.OUR_PRODUCT}.id, ${Tables.OUR_PRODUCT}.content,${Tables.USER}.name as createdBy, ${Tables.OUR_PRODUCT}.updatedBy
                      FROM ${Tables.OUR_PRODUCT}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.OUR_PRODUCT}.createdBy WHERE ${Tables.OUR_PRODUCT}.id=${'1'}
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

    public static UpdateOurProduct(content: string, updatedBy: string): Promise<OurProduct> {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.OUR_PRODUCT} SET content=?, createdBy=? WHERE id=1`, [content, updatedBy], (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(null);
            });
        });
    }

}