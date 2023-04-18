import { Request, Response } from "express";
import { failedResponse } from "../utils/responses";
import mysql from "mysql";
import { mysqlQuery } from "../config/mysql";
import { generateShortUrlCode, insertUrlData } from "../utils/utils";
import { domain, protocol } from "../config/site";

export async function shortUrlApiController(req: Request, res: Response) {
    const longUrl = (req.query?.longUrl as string);

    if(longUrl === undefined || longUrl === "undefined") {
        failedResponse("long url expected", res);
        return;
    }

    const shortUrlCode = await generateShortUrlCode(longUrl, 7);
    await insertUrlData(longUrl, shortUrlCode); /* FIXIT: It would be great to 
                                                   have info weather it was success or failed
                                                   for respond to user it failed, if failed.
                                                   Try async await format in `insertUrlData` func. */

    const shortUrl = `${protocol}://${domain}/${shortUrlCode}`;

    res.json({
        info: "success",
        shortUrl: shortUrl,
    });

}

interface ILongUrl {
    long_url: string,
}

async function fetchLongUrlFromRandomUrlTable(shortUrlCode: string): Promise<ILongUrl[]> {
    const queryString = `SELECT long_url from rusers_urls WHERE short_url=${mysql.escape(shortUrlCode)}`;
    const results = await mysqlQuery(queryString);
    const resultsArray: ILongUrl[] = JSON.parse(JSON.stringify(results));
    return resultsArray;
}

async function fetchLongUrlFromUserUrlTable(shortUrlCode: string): Promise<ILongUrl[]> {
    const queryString = `SELECT long_url from uaccount_urls WHERE short_url=${mysql.escape(shortUrlCode)}`;
    const results = await mysqlQuery(queryString);
    const resultsArray: ILongUrl[] = JSON.parse(JSON.stringify(results));
    
    return resultsArray;
}

async function fetchUrlFromDB(shortUrlCode: string): Promise<string | undefined> {
    let resultsArray = await fetchLongUrlFromRandomUrlTable(shortUrlCode);    
    if(resultsArray.length > 0)
        return resultsArray[0].long_url;
        
    resultsArray = await fetchLongUrlFromUserUrlTable(shortUrlCode);
    if(resultsArray.length > 0)
        return resultsArray[0].long_url;
    
    return undefined;
}

export async function shortUrlRedirectController(req: Request, res: Response) {
    const shortUrlCode = req.params?.shortUrlCode;
    
    if(shortUrlCode === undefined || shortUrlCode === null || shortUrlCode === "undefined") {
        res.render("404Page", {
            pageTitle: '404 Page',
        });
        return;
    }

    const longUrl = await fetchUrlFromDB(shortUrlCode);

    if(longUrl === undefined) {
        res.render("404Page", {
            pageTitle: '404 Page',
        });
        return;
    }

    res.redirect(longUrl);

} 