import { Request, Response } from "express";
import { failedResponse } from "../../utils/responses";
import { generateShortUrlCode, insertUrlData, insertUrlDataForUsers, todaysDate, urlCodeAlreadyExists, urlCodeAlreadyExistsInAccounts } from "../../utils/utils";
import { domain, protocol } from "../../config/site";
import { parseCookie } from "../../middleware/auth";
import mysql from "mysql";
import { mysqlQuery } from "../../config/mysql";

export async function shortUrlProtectedApi(req: Request, res: Response) {
    const longUrl = (req.query?.longUrl as string);
    let shortUrlCode = (req.query?.customCode as string);
    
    if(longUrl.length <= 0 || longUrl === undefined || longUrl === "undefined") {
        failedResponse("long url expected", res);
        return;
    }

    if(shortUrlCode.length <= 0 || shortUrlCode === undefined || shortUrlCode === "undefined") {
        shortUrlCode = await generateShortUrlCode(longUrl, 7);
    }

    if(await urlCodeAlreadyExists(shortUrlCode) || await urlCodeAlreadyExistsInAccounts(shortUrlCode)) {
        res.json({
            info: "custom short url id already exists!",
            shortUrl: '',
        });
        return;
    }

    const username = parseCookie(req)?.split("-")[1];
    const queryString = `SELECT id from uaccounts WHERE username=${mysql.escape(username)}`;
    const results = await mysqlQuery(queryString);
    const resultsArray = JSON.parse(JSON.stringify(results));
    if(resultsArray.length <= 0) {
        failedResponse('failed', res);
        return;
    }
    const id = resultsArray[0].id;
    
    const creationDate: string = todaysDate();
    await insertUrlDataForUsers(id, longUrl, shortUrlCode, creationDate);

    const shortUrl = `${protocol}://${domain}/${shortUrlCode}`;

    res.json({
        info: "success",
        shortUrl: shortUrl,
    });
}