import { Request, Response } from "express";
import { iFacts, FACTS } from "../models/facts";
import { randomNumberGenerator } from "../utils/utils";

export async function factsApiController(_: Request, res: Response) {    
    const randomIndex = await randomNumberGenerator(0, FACTS.length);
    const fact: iFacts = FACTS[randomIndex];
    res.json(fact);
}