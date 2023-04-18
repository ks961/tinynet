import { Router, Request, Response } from "express";
import { indexPageController } from "../../controllers";
import { isAuthenticated } from "../../middleware/auth";

const indexRoute = Router();

indexRoute.get("/", isAuthenticated, (req: Request, res: Response)=> {
    indexPageController(res);
});

export default indexRoute;