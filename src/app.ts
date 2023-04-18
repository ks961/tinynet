import express from "express";
import bodyParser from "body-parser";
import dbConn from "./config/mysql";

const PORT = 3000;
const DOMAIN = `127.0.0.1:${3000}`;
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));


/* Routes Imports */
import loginRoute from "./routes/public/login";
import indexRoute from "./routes/public";
import signupRoute from "./routes/public/signup";
import factsRoute from "./routes/public/facts";
import homeRoute from "./routes/protected/home";
import logoutRoute from "./routes/public/logout";
import shortUrlRoute from "./routes/public/shorturl";

app.use(indexRoute);
app.use(loginRoute);
app.use(signupRoute);
app.use(factsRoute);
app.use(logoutRoute);
app.use(shortUrlRoute);
app.use("/home", homeRoute);

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
    console.log(`Link: http://${DOMAIN}`);
});



/* CLEANUP ON QUIT */
process.on('SIGINT', ()=> {
    console.log('closing connnection to database...');
    dbConn.end((err)=> {
        if(err) throw err;
        process.exit(0);
    });
});