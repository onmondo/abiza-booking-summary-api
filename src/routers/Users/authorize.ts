import { trpcInstance } from '../../util/trpc'
import { TRPCError } from '@trpc/server';
import { passwordSchema } from './validations';
import User from '../../services/User'

export default class AuthorizerRoutes {
    static v1 = class v1 {
        static loginRouter = trpcInstance.procedure
            .input((value) => {
                const validationResult = passwordSchema.validate(value)
                console.log('validat    ionResult', validationResult)
                if (validationResult.error) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: validationResult.error.details[0].message })
                }
                return validationResult.value
            })
            .mutation(async(request) => {
                console.log('request.input', request.input)
                const response = await User.v1.login(request.input)
                
                if (response instanceof Error) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: response.message })
                }

                return response
            })
    }
}