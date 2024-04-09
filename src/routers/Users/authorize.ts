import { trpcInstance } from '../../util/trpc'
import { TRPCError } from '@trpc/server';
import { passwordSchema, refreshTokenSchema } from './validations';
import User from '../../services/User'
import moment from 'moment';
import { ILoginTokens, IRefreshToken } from '../../interface/Auth';
import jwt from 'jsonwebtoken'
import Registration from '../../services/Registration';
import { envKeys } from '../../util/config';

export default class AuthorizerRoutes {
    static v1 = class v1 {
        static loginRouter = trpcInstance.procedure
            .input((value) => {
                const validationResult = passwordSchema.validate(value)
                // console.log('validationResult', validationResult)
                if (validationResult.error) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: validationResult.error.details[0].message })
                }
                return validationResult.value
            })
            .mutation(async({ input, ctx }) => {
                // console.log('request.input', input)
                const response = await User.v1.login(input)
                
                if (response instanceof Error) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: response.message })
                }
                const loginTokens = response as ILoginTokens;
                const cookies = await AuthorizerRoutes.v1.setCookie(loginTokens);
                ctx.res.setHeader("Set-Cookie", cookies);
                
                return response;
            })
        static refreshRouter = trpcInstance.procedure
            .input((value) => {
                const validationResult = refreshTokenSchema.validate(value)
                if (validationResult.error) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: validationResult.error.details[0].message })
                }
                console.log("validationResult", validationResult)
                return validationResult.value
            })
            .mutation(async({ input, ctx }) => {

                const { REFRESHER_SECRET_KEY } = envKeys();
                const { refreshToken } = input as { refreshToken: string };
                console.log('refreshToken', refreshToken);

                if (!refreshToken) {
                    throw new TRPCError({ code: "BAD_REQUEST" })
                }

                const decodedToken: string | jwt.JwtPayload | unknown = await jwt.decode(refreshToken)

                const userIdentity = decodedToken as jwt.JwtPayload;
                const userAccount = await Registration.v1.getUserAccount(userIdentity.username);
        
                if (!userAccount) {
                    throw new TRPCError({ code: 'UNAUTHORIZED' })
                }

                const isVerified = jwt.verify(refreshToken, REFRESHER_SECRET_KEY)
                if (!isVerified) {
                    throw new TRPCError({ code: 'UNAUTHORIZED' })
                }
                

                const response = await User.v1.refreshToken({ username: userIdentity.username, refreshToken })
            
                if (response instanceof Error) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: response.message })
                }
                const loginTokens = response as ILoginTokens;
                const cookies = await AuthorizerRoutes.v1.setCookie(loginTokens);
                ctx.res.setHeader("Set-Cookie", cookies);

                return response;
            })
        private static setCookie = async (loginTokens: ILoginTokens): Promise<string[]> => {
            // path property of cookie can be useful when your users have roles
            // and restric only what path can be access
            const expiresInAMinute = moment().add("minute", 1).toString();
            const expiresIn5Days = moment().add("day", 5).toString();
            return [
                `access_token=${loginTokens.accessToken}; Domain="localhost:8080"; Path=/api/v1; Expires=${expiresInAMinute};`,
                `refresh_token=${loginTokens.refreshToken}; Domain="localhost:8080"; Path=/api/v1; Expires=${expiresIn5Days};`,
            ];
        }
        static logoutRouter = trpcInstance.procedure
            .mutation(({ input, ctx }) => {

                const expiresImmediate = moment().add("millisecond", 1);
                ctx.res.setHeader("Set-Cookie",[
                    `access_token=${""}; Domain="localhost:8080"; Path=/api/v1; Expires=${expiresImmediate};`,
                    `refresh_token=${""}; Domain="localhost:8080"; Path=/api/v1; Expires=${expiresImmediate};`,
                ]);

                return { message: "User logged out" }
            })        
    }
}