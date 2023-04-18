import { Response } from "express";

function fetchGreeting() {
    const time = new Date().getHours();
    if(time > 0 && time < 12) {
        return "Good morning,";
    } else if(time > 12 && time < 16) {
        return "Good afternoon,";
    } else if(time > 16 && time < 22) {
        return "Good evening,";
    } else {
        return "Hola!";
    }
}

export function indexPageController(res: Response) {
    res.render("index", {
        pageTitle: "tinyNET -URL Shortener",
        pageTo: "login", /* FIXIT: Could be done better. [ NavBar Login/Signup button ] */
        greetings: fetchGreeting(),
    });
}