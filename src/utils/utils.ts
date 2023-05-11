import mysql from "mysql";
import dbConn, { mysqlQuery } from "../config/mysql";

export const randomNumberGenerator = async (min: number, max: number): Promise<number> => {
    const num = Math.floor(Math.random() * max - min) + min;
    if(num < min || num > max) return randomNumberGenerator(min, max);

    return num;
}

export function verifyNotEmpty(value: unknown): boolean {
    return (value !== undefined || value !== null);
}

export async function urlCodeAlreadyExists(urlCode: string): Promise<boolean> {
    const queryString = `SELECT short_url FROM rusers_urls WHERE short_url=${mysql.escape(urlCode)}`;
    const results = await mysqlQuery(queryString);
    const resultsArray = JSON.parse(JSON.stringify(results));
    
    return (resultsArray.length > 0);
}

export async function urlCodeAlreadyExistsInAccounts(urlCode: string): Promise<boolean> {
    const queryString = `SELECT short_url FROM uaccount_urls WHERE short_url=${mysql.escape(urlCode)}`;
    const results = await mysqlQuery(queryString);
    const resultsArray = JSON.parse(JSON.stringify(results));

    return (resultsArray.length > 0);
}

export async function generateShortUrlCode(longUrl: string, length: number): Promise<string> {
    let randomString: string = '';
    for(let idx = 0; idx < longUrl.length; idx++) {
        if(idx % 2 === 0) {
            randomString += String.fromCharCode(await randomNumberGenerator(65, 90));
        } else if(idx === Math.floor(longUrl.length / 2)) {
            randomString += `${await randomNumberGenerator(idx, length+idx) + Math.floor(longUrl.length/2)}`;
        } else {
            randomString += `${await randomNumberGenerator(idx, length+idx)}`;   
        }
    }

    randomString = randomString.slice(randomString.length - length).toLowerCase();   

    if(await urlCodeAlreadyExists(randomString) || await urlCodeAlreadyExistsInAccounts(randomString)) return generateShortUrlCode(longUrl, length);

    return randomString;
}

export async function insertUrlData(longUrl: string, shortUrlCode: string) {
    let queryString = "INSERT INTO rusers_urls (long_url, short_url) VALUES (?, ?)";    
    const inserts = [longUrl, shortUrlCode];
    queryString = mysql.format(queryString, inserts);
    
    dbConn.query(queryString, function (err, _) {
      if (err) throw err; /*TODO: log it to file [ why, it failed ] */
    });
}

export interface ISUrlClickInfo {
    visited_date: string,
    clicks: number,
};

export async function insertUrlDataForUsers(id: number, longUrl: string, shortUrlCode: string, creationDate: string) {
    const visitsInfo: ISUrlClickInfo[] = [];
    const visitsInfoSerialized: string = JSON.stringify(visitsInfo);
    let queryString = "INSERT INTO uaccount_urls (id, long_url, short_url, creation_date, visits_info) VALUES (?, ?, ?, ?, ?)";    
    const inserts = [id, longUrl, shortUrlCode, creationDate, visitsInfoSerialized];
    queryString = mysql.format(queryString, inserts);
    
    dbConn.query(queryString, function (err, _) {
      if (err) throw err; /*TODO: log it to file [ why, it failed ] */
    });
}

export function todaysDate(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    const date = `${day}/${month}/${year}`;
    
    return date;
}