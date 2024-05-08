import { TRPCError } from '@trpc/server';
import { trpcInstance } from '../../util/trpc'
import jwt from 'jsonwebtoken'
import Registration from '../../services/Registration';
import { envKeys } from '../../util/config';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const isAuthenticatedMiddleware = trpcInstance.middleware( async ({ ctx, next }) => {
    console.log('context', ctx.req.headers.authorization);
    const bearerToken = ctx.req.headers.authorization
    
    const { REGISTRATION_SECRET_KEY } = envKeys();

    if (bearerToken) {
        const token = bearerToken.split(' ')[1];
        console.log('token', token);
        const decodedToken: string | jwt.JwtPayload | unknown = await jwt.decode(token)
        const userIdentity = decodedToken as jwt.JwtPayload;
        const userAccount = await Registration.v1.getUserAccount(userIdentity.username);

        if (userAccount) {
            const isVerified = jwt.verify(token, REGISTRATION_SECRET_KEY)
            if (isVerified) {
                return next();
            }
        }
        
    }

    throw new TRPCError({ code: 'UNAUTHORIZED'})
})

export const signingUpProcedure = trpcInstance.procedure.use(isAuthenticatedMiddleware)

export const authorizeUser: RequestHandler = 
    async (req: Request, res: Response, next: NextFunction) => {
        const bearerToken = req.headers.authorization;
        const csrfTokenRequest = req.body.csrfToken;
        if (!bearerToken) {
            return res.sendStatus(401)
        }

        try {
            const token = bearerToken.split(' ')[1];
            const decodedToken: string | jwt.JwtPayload | unknown = await jwt.decode(token)
            const userIdentity = decodedToken as jwt.JwtPayload;
            const userAccount = await Registration.v1.getUserAccount(userIdentity.username);
            if (!userAccount) {
                res.status(400)
                    .json({
                        message: 'User does not exist',
                    })
                    
                    next(new Error("Bad Request"))
            }
    
            const isVerified = jwt.verify(token, envKeys().AUTHORIZER_SECRET_KEY)
            if (!isVerified) {
                return res.sendStatus(401)
            }
            
            if (csrfTokenRequest !== userAccount.csrfToken) {
                // might want to log this attack
                return res.sendStatus(401)
            }

            res.locals.user = userAccount;
            next();
        } catch(error) {
            return res.sendStatus(401)
        }

    };