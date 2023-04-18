import { Request, Response, Router } from "express";
import { shortUrlApiController, shortUrlRedirectController } from "../../controllers/shorturl";
import { shortUrlProtectedApi } from "../../controllers/protected/shorturl";
import { isAuthenticatedForApi } from "../../middleware/auth";


const shortUrlRoute = Router();

shortUrlRoute.post("/short", (req: Request, res: Response) => {
    shortUrlApiController(req, res);
});

shortUrlRoute.post("/p/short", isAuthenticatedForApi, (req: Request, res: Response) => {
    shortUrlProtectedApi(req, res);
});

shortUrlRoute.get("/:shortUrlCode", (req: Request, res: Response) => {
    shortUrlRedirectController(req, res);
});

export default shortUrlRoute;