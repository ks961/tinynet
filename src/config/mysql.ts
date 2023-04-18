import mysql from "mysql";
import { promisify } from "util";

const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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
