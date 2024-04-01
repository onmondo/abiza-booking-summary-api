import { trpcInstance } from '../../util/trpc'
import RegistrationRoutes from './authenticate'
import AuthorizerRoutes from './authorize'

export const trpcRouter = trpcInstance.router({
    health: trpcInstance.procedure.query(() => {
        return 'Up and running...'
    }),
    register: RegistrationRoutes.v1.registerRouter,
    verifyOtp: RegistrationRoutes.v1.verifyOtpRouter,
    getOtp: RegistrationRoutes.v1.requestOtpRouter,
    profile: RegistrationRoutes.v1.submitProfileRouter,
    pass: RegistrationRoutes.v1.setPassword,
    login: AuthorizerRoutes.v1.loginRouter,
})