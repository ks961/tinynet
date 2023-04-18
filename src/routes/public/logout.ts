import { Request, Response, Router } from "express";
import { logoutRequestController } from "../../controllers/logout";

const logoutRoute = Router();


logoutRoute.post('/logout', (req: Request, res: Response)=> {
    logoutRequestController(req, res);
});

export default logoutRoute;