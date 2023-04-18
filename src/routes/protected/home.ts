import { Request, Response, Router } from "express";
import { homePageController } from "../../controllers/protected/home";
import { isAuthenticatedProtected } from "../../middleware/auth";

const homeRoute = Router();

function isLoggedIn(): boolean {
    return true;
}

homeRoute.get("/:username", isAuthenticatedProtected, (req: Request, res: Response) => {
    homePageController(req, res);
});

export default homeRoute;