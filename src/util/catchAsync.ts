import { RequestHandler, Request, Response, NextFunction } from "express"

export const catchAsync = (request: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            request(req, res, next)
        } catch(error: any) {
            next(error)
        }
    }
}