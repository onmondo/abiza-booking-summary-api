import { trpcInstance } from '../../util/trpc'
import { TRPCError } from '@trpc/server';
import Registration from "../../services/Registration"
import { registerSchema, profileSchema, passwordSchema, otpSchema, requestOtpSchema } from './validations';
import { signingUpProcedure } from "./middlewares";
import { TProfile } from '../../types/RegistrationTypes';

export default class RegistrationRoutes {
    static v1 = class v1 {
        static registerRouter = trpcInstance.procedure
            .input((value) => {                
                const validationResult = registerSchema.validate(value)
                console.log('validationResult', validationResult)
                if (validationResult.error) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: validationResult.error.details[0].message })
                }
                return validationResult.value
            })
            .mutation(async(request) => {
                console.log('request.input', request.input)
                const response: any = await Registration.v1.register(request.input)
                
                if (response instanceof Error) {
                    throw new TRPCError({ code: 'PRECONDITION_FAILED', message: response.message })
                }
            
                return response
            })
            
        static verifyOtpRouter = trpcInstance.procedure
            .input((value) => {
                const validationResult = otpSchema.validate(value)
                if (validationResult.error) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: validationResult.error.details[0].message })
                }
                return validationResult.value
            })
            .mutation(async(request) => {
                const response = await Registration.v1.verifyOtp(request.input)
                if (response instanceof Error) {
                    throw new TRPCError({ code: 'BAD_REQUEST', message: response.message })
                }
                return response
            });
            
        static requestOtpRouter = trpcInstance.procedure
            .input((value) => {
                const validationResult = requestOtpSchema.validate(value)
                if (validationResult.error) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: validationResult.error.details[0].message })
                }
                return validationResult.value
            }).mutation(async(request) => {
                const response = await Registration.v1.requestOtp(request.input)
                if (response instanceof Error) {
                    throw new TRPCError({ code: 'PRECONDITION_FAILED', message: response.message })
                }
                return response
            })

        static submitProfileRouter = signingUpProcedure
            .input((value) => {
                const validationResult = profileSchema.validate(value)
                console.log('validationResult', validationResult)
                if (validationResult.error) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: validationResult.error.details[0].message })
                }
                return validationResult.value
            })
            .output((value) => {
                const validationResult = profileSchema.validate(value)
                console.log('validationResult', validationResult)
            
                return validationResult.value
            })
            .mutation(async(request) => {
                console.log('request.input', request.input)
                const response: TProfile = await Registration.v1.submitProfile(request.input)
                
                if (!response) {
                    throw new TRPCError({ code: 'PRECONDITION_FAILED' })
                }
            
                return response
            })
            
        static setPassword = signingUpProcedure
            .input((value) => {
                const validationResult = passwordSchema.validate(value)
                console.log('validationResult', validationResult)
                if (validationResult.error) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: validationResult.error.details[0].message })
                }
                return validationResult.value
            })
            .mutation(async(request) => {
                console.log('request.input', request.input)
                const response = await Registration.v1.encryptPassword(request.input)
                
                if (!response) {
                    throw new TRPCError({ code: 'NOT_FOUND' })
                }
            
                return response
            })            
    }
}