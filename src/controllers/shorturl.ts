import { Request, Response } from "express";
import { failedResponse } from "../utils/responses";
import mysql from "mysql";
import { mysqlQuery } from "../config/mysql";
import { ISUrlClickInfo, generateShortUrlCode, insertUrlData, todaysDate } from "../utils/utils";
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

interface IURLInfo {
    long_url: string,
    visits: number,
    visits_info?: any,
}

async function fetchLongUrlFromRandomUrlTable(shortUrlCode: string): Promise<IURLInfo[]> {
    const queryString = `SELECT long_url from rusers_urls WHERE short_url=${mysql.escape(shortUrlCode)}`;
    const results = await mysqlQuery(queryString);
    const resultsArray: IURLInfo[] = JSON.parse(JSON.stringify(results));
    return resultsArray;
}

async function fetchUrlInfoFromUserUrlTable(shortUrlCode: string): Promise<IURLInfo[]> {
    const queryString = `SELECT long_url, visits, visits_info from uaccount_urls WHERE short_url=${mysql.escape(shortUrlCode)}`;
    const results = await mysqlQuery(queryString);
    const resultsArray: IURLInfo[] = JSON.parse(JSON.stringify(results));
    
    return resultsArray;
}

export function getArrayFromBuffer(result: any): ISUrlClickInfo[] {
    const buffer = Buffer.from(result.data);
    const jsonString = buffer.toString('utf-8');
    const jsonArray: ISUrlClickInfo[] = JSON.parse(jsonString);
    return jsonArray;
}

async function fetchUrlInfoFromDB(shortUrlCode: string): Promise<string | undefined> {
    let resultsArray = await fetchLongUrlFromRandomUrlTable(shortUrlCode);    
    if(resultsArray.length > 0)
        return resultsArray[0].long_url;
        
    resultsArray = await fetchUrlInfoFromUserUrlTable(shortUrlCode);
    
    if(resultsArray.length <= 0)
        return undefined;
    
    const totalVists: number = resultsArray[0].visits ?? 0;
    const visitsInfo: ISUrlClickInfo[] = getArrayFromBuffer(resultsArray[0].visits_info);

    const date = todaysDate();
    const index = visitsInfo.findIndex(visits => visits.visited_date === date);
    
    /*
        If index is >= 0 then element found so, increasing the click value on that date else adding new
        object todays Date and totalVisits which will be 1, cause it the first visit.
    */
    (index >= 0) ? visitsInfo[index].clicks++ : visitsInfo.push({ visited_date: date, clicks: 1 });
    const serializedVisitsInfo: string = JSON.stringify(visitsInfo);
    
    const queryString = `UPDATE uaccount_urls SET visits = ${totalVists+1}, visits_info = '${serializedVisitsInfo}' WHERE short_url=${mysql.escape(shortUrlCode)};`
    await mysqlQuery(queryString);

    return resultsArray[0].long_url;
}

export async function shortUrlRedirectController(req: Request, res: Response) {
    const shortUrlCode = req.params?.shortUrlCode;

    if(shortUrlCode === undefined || shortUrlCode === null || shortUrlCode === "undefined") {
        res.render("404Page", {
            pageTitle: '404 Page',
        });
        return;
    }

    const longUrl = await fetchUrlInfoFromDB(shortUrlCode);

    if(longUrl === undefined) {
        res.render("404Page", {
            pageTitle: '404 Page',
        });
        return;
    }

    res.redirect(longUrl);

} 