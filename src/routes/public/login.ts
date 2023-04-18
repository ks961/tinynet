import { Router, Request, Response } from "express";
import { loginPageController, loginRequestController } from "../../controllers/login";
import { isAuthenticated } from "../../middleware/auth";

const loginRoute = Router();

loginRoute.get("/login", isAuthenticated, (req: Request, res: Response)=> {
    loginPageController(req, res);
});

loginRoute.post("/login", (req: Request, res: Response) => {
    loginRequestController(req, res);
});


// loginRoute.post("/loggedIn", (req: Request, res: Response, next: NextFunction) => {
//     isLoggedIn(req, res);
// });

export default loginRoute;