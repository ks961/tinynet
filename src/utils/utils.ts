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

export async function generateShortUrlCode(longUrl: string, length: number): Promise<string> {
    let randomString: string = '';
    for(let idx = 0; idx < longUrl.length; idx++) {
        if(idx % 2 === 0) {
            randomString += String.fromCharCode(await randomNumberGenerator(65, 90));
        } else {
            randomString += `${await randomNumberGenerator(idx, length+idx)}`;
            
        }
    }

    randomString = randomString.slice(randomString.length - length).toLowerCase();   

    if(await urlCodeAlreadyExists(randomString)) return generateShortUrlCode(longUrl, length);

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

export async function insertUrlDataForUsers(id: number, longUrl: string, shortUrlCode: string) {
    let queryString = "INSERT INTO uaccount_urls (id, long_url, short_url) VALUES (?, ?, ?)";    
    const inserts = [id, longUrl, shortUrlCode];
    queryString = mysql.format(queryString, inserts);
    
    dbConn.query(queryString, function (err, _) {
      if (err) throw err; /*TODO: log it to file [ why, it failed ] */
    });
}