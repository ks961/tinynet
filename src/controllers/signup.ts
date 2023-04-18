import { Request, Response } from "express"
// import { tempDB } from "../models/tempDB";
import dbConn from "../config/mysql";
import mysql from "mysql";
import { successResponse, failedResponse } from "../utils/responses";

export interface iCredentials {
    username: string,
    password: string,
};

export function signupPageController(res: Response) {
    res.render("signup", {
        pageTitle: "Signup -tinyNET",
        pageTo: "login", /* FIXIT: Could be done better. */
    })
}

function insertCredentials(credentials: iCredentials, res: Response) {
    const queryString = "INSERT INTO uaccounts (username, password) VALUES (?, ?)";
    const values = [credentials.username, credentials.password];
    const statement = mysql.format(queryString, values);
    dbConn.query(statement, (err) => {
        if(err) {                    /* TODO: Log in File. */
            console.log(err);
            failedResponse('failed', res);
        }
        successResponse('success', res);
    });
}

export function signupController(req: Request, res: Response) {
    const credentials: iCredentials = JSON.parse(req.query.credentials as string);

    if(!credentials.username || !credentials.password && credentials.username.length <= 0 || credentials.password.length <= 0) {
        failedResponse('failed', res);
        return;
    }

    insertCredentials(credentials, res);
}