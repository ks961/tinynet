import { Request, Response } from "express";
import { verifyNotEmpty } from "../../utils/utils";
import { failedResponse } from "../../utils/responses";
import mysql from "mysql";
import { mysqlQuery } from "../../config/mysql";
import { getArrayFromBuffer } from "../shorturl";
// import { loggedInClients } from "../models/clientsLoggedIn";

interface IUserInfoResults {
    id: string,
};

async function fetchUrlsHistory(username: string, res: Response) {
    let queryString = `SELECT id FROM uaccounts WHERE username = ${mysql.escape(username)}`;
    const idResults = await mysqlQuery(queryString);
    const idResultArray: IUserInfoResults[] = JSON.parse(JSON.stringify(idResults));
    
    if(idResultArray.length <= 0) {
        failedResponse(`invalid username ${username}`, res);
        return;
    }

    
    try {
        queryString = `SELECT long_url, short_url, visits, creation_date FROM uaccount_urls WHERE id="${idResultArray[0].id}"`;
        const result = await mysqlQuery(queryString);
        const resultsArray = JSON.parse(JSON.stringify(result));
        return resultsArray;
    } catch(err) {
        failedResponse(`invalid username ${username}`, res);
        return;        
    }
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

export async function homePageApiController(req: Request, res: Response) {
    const shortUrlCode: string = (req.params?.shortUrlCode as string);
    console.log(shortUrlCode)
    
    if(!verifyNotEmpty(shortUrlCode)) {
        failedResponse(`invalid request for : \`${shortUrlCode}\`.`, res);
        return;
    }
    
    const queryString = `SELECT creation_date, visits_info from uaccount_urls WHERE short_url=${mysql.escape(shortUrlCode)}`;
    const results = await mysqlQuery(queryString);
    const resultsArray: any[] = JSON.parse(JSON.stringify(results));
   
    
    if(resultsArray.length <= 0) {
        failedResponse(`invalid request for : \`${shortUrlCode}\`.`, res);
        return;    
    }

    const creationDate = resultsArray[0].creation_date;
    const visitsInfo = getArrayFromBuffer(resultsArray[0].visits_info);

    const responseData = {
        creationDate,
        visitsInfo,
    };

    res.json({
        info: 'success',
        data: responseData,
    });
}