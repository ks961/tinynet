import { Request, Response } from "express";
import { verifyNotEmpty } from "../../utils/utils";
import { failedResponse } from "../../utils/responses";
import mysql from "mysql";
import { mysqlQuery } from "../../config/mysql";
// import { loggedInClients } from "../models/clientsLoggedIn";

async function fetchUrlsHistory(username: string, res: Response) {
    let queryString = `SELECT id FROM uaccounts WHERE username = ${mysql.escape(username)}`;
    const idResults = await mysqlQuery(queryString);
    const idResultArray = JSON.parse(JSON.stringify(idResults));
    
    if(idResultArray.length <= 0) {
        failedResponse(`invalid username ${username}`, res);
        return;
    }

    queryString = `SELECT * FROM uaccount_urls WHERE id = "${idResultArray[0]}"`;
    const result = await mysqlQuery(queryString);
    const resultsArray = JSON.parse(JSON.stringify(result));
    return resultsArray;
}


export async function homePageController(req: Request, res: Response) {
    const username: string = req.params?.username;
    
    if(!verifyNotEmpty(username)) {        
        failedResponse(`invalid request with username: \`${username}\`.`, res);
        return;
    }

    const resultsArray = await fetchUrlsHistory(username, res);

    res.render("home", {
        pageTitle: "HomePage -tinyNET",
        username: username,
        resultsArray: resultsArray,
    });
}