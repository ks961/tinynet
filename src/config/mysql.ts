import mysql from "mysql";
import { promisify } from "util";

const dbConn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Pr1nc3@8909',
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
