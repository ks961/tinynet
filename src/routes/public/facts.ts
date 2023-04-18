import { Router, Request, Response } from "express";
import { factsApiController } from "../../controllers/facts";

const factsRoute = Router();

factsRoute.post("/facts", (req: Request, res: Response)=> {
    factsApiController(req, res);
});

export default factsRoute;