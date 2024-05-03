import { Request, Response, NextFunction, ErrorRequestHandler } from "express"

export default class ErrorHandlers {
    static v1 = class v1 {
        static errorHandler: ErrorRequestHandler = (_err, req: Request, res: Response, next: NextFunction): void  => {
            const errorMessage = `Failed authentication or authorization process: ${_err.message}`
            console.log(errorMessage)
            res.status(500).json({
                message: 'Internal Server Error',
                error: errorMessage
            });
        }
    }
}