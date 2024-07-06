import mysql from "mysql";
import { promisify } from "util";

const dbConn = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});

dbConn.connect((err)=> {
    if(err) {
        console.log(err);
        return;
    }
    console.log('connected');
});

export const mysqlQuery = promisify(dbConn.query).bind(dbConn);

export default dbConn;
