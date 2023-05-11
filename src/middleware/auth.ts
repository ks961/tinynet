import { Request, Response, NextFunction } from "express";
import { loggedInClients } from "../models/clientsLoggedIn";
import { failedResponse } from "../utils/responses";

export function parseCookie(req: Request) {
    const cookieValue = req.headers.cookie?.split("; ")[0].split("=")[1];
    return cookieValue;
}

export function isAuthenticatedProtected(req: Request, res: Response, next: NextFunction) {
    const username: string = req.params?.username;
    
    const isEmpty = (username === undefined || username.length <= 0 || username === null);
    if(isEmpty) {
        res.redirect("/login");
        return;
    }
    
    const cookieValue = parseCookie(req);
    
    const isLoggedIn = loggedInClients.some(client => (client.username === username &&  client.cookieValue === cookieValue));
    if(!isLoggedIn) {
        res.redirect("/login");
        return;
    }
    
    next();
}

export function isAuthenticatedForApi(req: Request, res: Response, next: NextFunction) {
    const cookieValue = parseCookie(req);
        
    const loggedInUser = loggedInClients.find(client => client.cookieValue === cookieValue);
    if(!loggedInUser) {
        failedResponse('You are not authenticated, Login and Try again.', res);
        return;
    }

    next();
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const cookieValue = parseCookie(req);    
    
    const loggedInUser = loggedInClients.find(client => client.cookieValue === cookieValue);
    if(loggedInUser) {
        res.redirect(`/home/${loggedInUser.username}`);
        return;
    }

    next();
}