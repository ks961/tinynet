import { Response } from "express";

export function failedResponse(response: string, res: Response) {
    res.json({
        info: response,
    });
}

export function successResponse(response: string, res: Response) {
    res.json({
        info: response,
    });
}
