import { Request, Response, Router } from "express";
import { homePageApiController, homePageController } from "../../controllers/protected/home";
import { isAuthenticatedProtected } from "../../middleware/auth";

const homeRoute = Router();

function isLoggedIn(): boolean {
    return true;
}

homeRoute.get("/:username", isAuthenticatedProtected, (req: Request, res: Response) => {
    homePageController(req, res);
});

homeRoute.post("/:username/:shortUrlCode", isAuthenticatedProtected, (req: Request, res: Response) => {
    homePageApiController(req, res);
});

export default homeRoute;