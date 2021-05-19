import { Encryption } from "../../utility";
import { Response, Request } from "express";
import { User, AuthenticatedRequest, ResponseObject } from "../../interfaces";
import { UsersDB } from "../../models/user";

class AdminController {
    constructor() {

    }

    public static loginByUserIdAndPassword = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const buff = Buffer.from(req.token, 'base64');
            const credential = buff.toString().split(':');
            if (credential.length !== 2) {
                return res.status(400).send();
            }
            const userId = credential[0];
            const password = credential[1];
            if(!userId || !password) {
                return res.status(400).send();
            }

            const user: User = await UsersDB.getUserByUserId(userId)

            if (!user) {
                res.status(403).send({
                    Message: `You don't have account with us`,
                    Data: null,
                });
            } else if (user && !Encryption.decryptPassword(password, user.password)) {
                res.status(401).send({
                    Message: `Incorrect password!`,
                    Data: null,
                });
            } else {
                delete user.password;
                delete user.createdOn;
                let token: any;
                try {
                    token = await Encryption.createToken(user);
                } catch (err) {
                    return res.status(500).end();
                }
                res.setHeader('Access-Control-Expose-Headers', 'Authorization');
                res.setHeader('Authorization', token);
                res.send(user);
            }
        } catch (error) {
            return res.status(500).end();
        }
    }
}

const LoginByUserIdAndPassword = AdminController.loginByUserIdAndPassword;

export {
    LoginByUserIdAndPassword,
}