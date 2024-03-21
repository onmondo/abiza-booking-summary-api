import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

const singleReportSchema = Joi.object({
    year: Joi.string(),
    month: Joi.string(),
    bookingId: Joi.string(),
});

export const validateSingleReport: RequestHandler = 
    (req: Request, res: Response, next: NextFunction) => {
        const validationResult = singleReportSchema.validate(req.body)
        
        if (validationResult.error) {
            return res.status(400)
                .json({
                    message: validationResult.error.details[0].message
                })
        }

        next();
}