import mysql from "mysql";
import { Request, Response } from "express";
import { iCredentials } from "./signup";
import { iLoggedInClient, loggedInClients } from "../models/clientsLoggedIn";
import { mysqlQuery } from "../config/mysql";
import { failedResponse } from "../utils/responses";

const timeLimit: Function = (): number => 60 * 60 * 24 * 7; /* 7 Days */

export function loginPageController(req: Request, res: Response) {
    res.render("login", {
        pageTitle: "Login -tinyNET",
        pageTo: "signup", /* FIXIT: Could be done better. */
    });
}

export const cookieName = "wli";

export const secretKey = "secretPass"; /* Change it and move to .env file */

function generateCookieForUser(username: string, currentTime: number): [string, string] {
    const validTill: number = timeLimit();
    const cookieValue = `${currentTime}-${username}-${validTill}`;

    const cookie = `${cookieName}=${cookieValue}; Path=/; Max-Age=${validTill}`;
    return [cookie, cookieValue];
}


async function verifyUserCredentials(credentials: iCredentials): Promise<boolean> {
    const table: string = "uaccounts";
    let queryString = `SELECT * FROM ${table} WHERE username = ${mysql.escape(credentials.username)}`;
    const results = await mysqlQuery(queryString);
    const resultsArray = JSON.parse(JSON.stringify(results));
    
    if(resultsArray.length <= 0) return false;
    
    const creds: iCredentials = resultsArray[0];
    return (creds.password === credentials.password);
}


/* Math.floor(((new Date().getTime() - s) / 60000)) > 30 */

export async function loginRequestController(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;

    const credentials: iCredentials = { username, password }
    
    /* search if it exists */
    const exists = await verifyUserCredentials(credentials);
    
    if(!exists) {
        failedResponse('failed', res);    
        return;
    }

    const currentTime = new Date().getTime();
    const [cookie, cookieValue]: [string, string] = generateCookieForUser(credentials.username, currentTime);
   
    const clientInfo: iLoggedInClient = {
        username: credentials.username,
        sessionStart: currentTime,
        cookieValue: cookieValue,
    }

    loggedInClients.push(clientInfo);
    
    res.setHeader('Set-Cookie', cookie);

    res.json({
        info: 'success',
    });
    
}

// export function isLoggedIn(req: Request, res: Response) {
//     const cookieValue = (req.query?.value as string);
    
//     if(cookieValue === "" || cookieValue === undefined) {
//         failedResponse('failed', res);
//     } 
    
//     const exists = loggedInClients.some(client => client.cookieValue === cookieValue);
//     if(!exists) {
//         failedResponse('failed', res);
//     }
    
//     res.json({
//         info: 'success',
//     });

// }