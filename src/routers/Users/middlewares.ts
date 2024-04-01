import { TRPCError } from '@trpc/server';
import { trpcInstance } from '../../util/trpc'
import jwt from 'jsonwebtoken'
import Registration from '../../services/Registration';
import { envKeys } from '../../util/config';

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