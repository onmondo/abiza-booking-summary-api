import { Router } from 'express'
import { trpcInstance } from '../../util/trpc'
import RegistrationRoutes from './authenticate'
import AuthorizerRoutes from './authorize'
import { validateLogin, validateRefreshToken } from './validations'
import ErrorHandlers from './errorHandlers'

const trpcRouter = trpcInstance.router({
    health: trpcInstance.procedure.query(() => {
        return 'Up and running...'
    }),
    register: RegistrationRoutes.v1.registerRouter,
    verifyOtp: RegistrationRoutes.v1.verifyOtpRouter,
    getOtp: RegistrationRoutes.v1.requestOtpRouter,
    profile: RegistrationRoutes.v1.submitProfileRouter,
    pass: RegistrationRoutes.v1.setPassword,
    login: AuthorizerRoutes.v1.loginRouter,
    refresh: AuthorizerRoutes.v1.refreshRouter,
    logout: AuthorizerRoutes.v1.logoutRouter,
})

const userProfiles = Router();

// userProfiles.post("/", RegistrationRoutes.v1.registerRouter)
//     .post("/otp", RegistrationRoutes.v1.verifyOtpRouter)
//     .get("/otp", RegistrationRoutes.v1.requestOtpRouter)
//     .post("/profile", RegistrationRoutes.v1.submitProfileRouter)
//     .post("/password", RegistrationRoutes.v1.setPassword)
userProfiles.post("/token", validateLogin, AuthorizerRoutes.v2.loginRouter, ErrorHandlers.v1.errorHandler)
    .put("/token", validateRefreshToken, AuthorizerRoutes.v2.refreshRouter, ErrorHandlers.v1.errorHandler)
    // .put("/token", AuthorizerRoutes.v1.refreshRouter)
    .delete("/token", AuthorizerRoutes.v1.logoutRouter)

export {
    trpcRouter,
    userProfiles
}