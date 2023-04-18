import { Request, Response, Router } from "express";
import { signupPageController, signupController } from "../../controllers/signup";
import { isAuthenticated } from "../../middleware/auth";

const signupRoute = Router();

signupRoute.get("/signup", isAuthenticated, (req: Request, res: Response)=> {
    signupPageController(res);
});

signupRoute.post("/signup", (req: Request, res: Response)=> {
    signupController(req, res);
});

export default signupRoute;