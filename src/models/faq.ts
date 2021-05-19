import db from './db';
import { Faq } from '../interfaces';
import { Tables } from '../configs/table.config';

export class FaqDataDB {
    constructor() {

    }

    public static getAllFaqData(): Promise<Array<Faq>> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.FAQ}.id, ${Tables.FAQ}.question, ${Tables.FAQ}.answer, ${Tables.USER}.name as createdBy
                      FROM ${Tables.FAQ}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.FAQ}.createdBy
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

    public static getFAQDataById(id: string): Promise<Faq> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.FAQ}.id, ${Tables.FAQ}.question, ${Tables.FAQ}.answer, ${Tables.USER}.name as createdBy
                      FROM ${Tables.FAQ}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.FAQ}.createdBy WHERE ${Tables.FAQ}.id=${id}
                      `, (err, res) => {
                if (err) {
                    return reject(err)
                }
                if (res.length) {
                    console.log(res)
                    return resolve(res.map((result: any) => Object.assign({}, result))[0]);
                }
                return resolve(null);
            });
        });
    }

    public static deleteFaqDataById(id: string): Promise<Faq> {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${Tables.FAQ} WHERE ${Tables.FAQ}.id=${id}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(null);
            });
        });
    }

    public static insertFaqData(question: string, answer: string, createdBy: string): Promise<string> {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${Tables.FAQ} (question, answer, createdBy) VALUES ('${question}', '${answer}', '${createdBy}')`, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res.insertId)
            });
        });
    }

}