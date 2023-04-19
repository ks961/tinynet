import mysql from "mysql";
import { promisify } from "util";

const dbConn = mysql.createConnection({
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'db_tinynet',
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
