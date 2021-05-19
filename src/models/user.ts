import db from './db';
import { User } from '../interfaces';
import { Tables } from '../configs/table.config';

export class UsersDB {
    constructor() {

    }

    public static getUserByUserId(userId: string): Promise<User> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${Tables.USER} WHERE userId = '${userId}'`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length) {
                    return resolve(Object.assign({}, res[0]));
                }
                return resolve(null);
            });
        });
    }
}