import db from '../models/db';
import { Developers } from '../interfaces/';
import { Tables } from '../configs/table.config';

export class DevelopersDataDB {

    constructor() {

    }
    
    public static getAllDevelopersData(): Promise<Array<Developers>> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.DEVELOPERS}.id, ${Tables.DEVELOPERS}.name, ${Tables.DEVELOPERS}.         description, ${Tables.USER}.name as createdBy, ${Tables.DEVELOPERS}.updatedBy,${Tables.DEVELOPERS}.designation, ${Tables.DEVELOPERS}.githubLink, ${Tables.DEVELOPERS}.linkedInLink
                      FROM ${Tables.DEVELOPERS}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.DEVELOPERS}.createdBy
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

    public static getDevelopersDataById(id: string): Promise<Developers> {
        return new Promise((resolve, reject) => {
            db.query(`SELECT ${Tables.DEVELOPERS}.id, ${Tables.DEVELOPERS}.name, ${Tables.DEVELOPERS}.         description, ${Tables.USER}.name as createdBy, ${Tables.DEVELOPERS}.updatedBy,${Tables.DEVELOPERS}.designation, ${Tables.DEVELOPERS}.githubLink, ${Tables.DEVELOPERS}.linkedInLink
                      FROM ${Tables.DEVELOPERS}
                      INNER JOIN ${Tables.USER} ON ${Tables.USER}.id=${Tables.DEVELOPERS}.createdBy WHERE ${Tables.DEVELOPERS}.id=${id}
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

    public static insertDevelopersData(name: string, description: string, createdBy: string, designation:string, githubLink: string, linkedInLink: string): Promise<string> {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${Tables.DEVELOPERS} (name, description, createdBy, designation, githubLink, linkedInLink) VALUES ('${name}', '${description}', '${createdBy}', '${designation}', '${githubLink}', '${linkedInLink}')`, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res.insertId)
            });
        });
    }

    public static updateDevelopersDataById(id: string, name: string, description: string, updatedBy: string, designation:string, githubLink: string, linkedInLink: string): Promise<Developers> {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${Tables.DEVELOPERS} SET name=?, description=?, createdBy=?, designation=?, githubLink=?, linkedInLink=? WHERE id=${id}`, [name, description, updatedBy,designation,githubLink,linkedInLink], (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(null);
            });
        });
    }

    public static deleteDevelopersDataById(id: string): Promise<Developers> {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${Tables.DEVELOPERS} WHERE ${Tables.DEVELOPERS}.id=${id}`, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(null);
            });
        });
    }
}