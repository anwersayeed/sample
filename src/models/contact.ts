import db from '../models/db';
import { Contact } from '../interfaces/contact.model';
import { Tables } from '../configs/table.config';

export class ContactDB {
    constructor(){
    }

    public static getAllContact(): Promise<Contact> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.CONTACT}.id, ${Tables.CONTACT}.name,${Tables.CONTACT}.email,${Tables.CONTACT}.phone,${Tables.CONTACT}.message,${Tables.CONTACT}.createdOn
                      FROM ${Tables.CONTACT}
                      `, (err, res) => {
                if (err) {
                    return reject(err)
                }
                console.log(res);
                if (res.length) {
                    console.log(res)
                    return resolve(res.map((result: any) => Object.assign({}, result)));
                }
                return resolve(null);
            });
        });
    }
    public static getContactById(id: string): Promise<Contact>{
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.CONTACT}.id, ${Tables.CONTACT}.name,${Tables.CONTACT}.email,${Tables.CONTACT}.phone,${Tables.CONTACT}.message
                      FROM ${Tables.CONTACT}  WHERE ${Tables.CONTACT}.id=${id}
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

    public static insertContact(name: string, email: string, phone_no: number, message: string): Promise<string> {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${Tables.CONTACT} (name, email, phone, message) VALUES ('${name}', '${email}', '${phone_no}','${message}')`, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res.insertId)
            });
        });
    }

}