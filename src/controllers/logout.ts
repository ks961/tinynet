import { Request, Response } from "express";
import { parseCookie } from "../middleware/auth";
import { failedResponse } from "../utils/responses";
import { loggedInClients } from "../models/clientsLoggedIn";
import { cookieName } from "./login";

const blankCookie = `${cookieName}=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

export function logoutRequestController(req: Request, res: Response) {
    const cookieValue = parseCookie(req);
    
    const loggedInUser = loggedInClients.filter(client => (client.cookieValue === cookieValue))[0];
    if(!loggedInUser) {
        failedResponse("invalid request for logout.", res);
        return;
    }
    
    res.json({
        info: 'success',
    });
}