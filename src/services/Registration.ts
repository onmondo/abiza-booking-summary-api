import { authenticator } from "otplib";
import { IRegistration, IsProfile, IUser } from "../interface/Auth";
import UserAccount from "../models/UserAccount";
import { TProfile, TUserAccount } from "../types/RegistrationTypes"
import { generateOtp } from "../util/otp";
import bcrypt from 'bcrypt';
import { envKeys } from "../util/config";
import { generateAccessToken } from "../util/accessToken"

export default class Registration {
    static v1 = class v1 {
        static async register(user: IRegistration): Promise<string> {
            
            const fetchUserResult: TUserAccount = await v1.getUserAccount(user.username);

            if (fetchUserResult) {
                throw new Error('User already registered')
            }
            const otp = generateOtp();

            const newUser: TUserAccount = {
                username: user.username,
                otp: otp.expectedOTP,
                otpSecret: otp.secret,
                otpVerified: false
            }

            const newUserResult = await UserAccount.create(newUser)

            const userAccount = newUserResult as TUserAccount;
            return userAccount.username;
        }

        static async getUserAccount(username: string): Promise<TUserAccount> {
            const fetchUserResult: TUserAccount | unknown  = await UserAccount.findOne({ username });
            const userAccount = fetchUserResult as TUserAccount;
            return userAccount;
        }

        static async requestOtp(request: IRegistration): Promise<{ otp: string }> {
        
            const otp = generateOtp()
            await UserAccount.findOneAndUpdate(
                { username: request.username }, 
                { 
                    otp: otp.expectedOTP,
                    otpSecret: otp.secret,
                    otpVerified: false
                }
            )
    
            return { otp: otp.expectedOTP };
            
        }

        static async verifyOtp(request: IRegistration): Promise<{ username: string, signupToken: string } | boolean > {

            const fetchUserResult: TUserAccount = await v1.getUserAccount(request.username);
            const registrationKey = envKeys().REGISTRATION_SECRET_KEY;

            const isOTPValid = authenticator.check(request.otp, fetchUserResult.otpSecret)
            if (isOTPValid) {
                const newUserAccount: TUserAccount | unknown = await UserAccount.findOneAndUpdate(
                    { username: request.username }, 
                    { 
                        otpVerified: true
                    }
                )

                const userAccount = newUserAccount as TUserAccount;
                return {
                    username: request.username,
                    signupToken: generateAccessToken({
                        username: userAccount.username,
                        secret: registrationKey
                    }, (60 * 5)) // expirest in 60 seconds
                }
            }


            throw new Error('OTP does not match or OTP already expired!');
        }

        static async submitProfile(request: IsProfile): Promise<TProfile> {
            await UserAccount.findOneAndUpdate(
                { username: request.username, otpVerified: true }, 
                { 
                    profile: {
                        firstname: request.firstName,
                        lastname: request.lastName,
                        birthdate: request.birthDate,
                    }
                }
            )

            return {
                firstname: request.firstName,
                lastname: request.lastName
            }
        }

        static async encryptPassword(request: IRegistration): Promise<{ username: string}> {

            // hash the password with salt
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(request.password, salt)

            await UserAccount.findOneAndUpdate(
                { username: request.username }, 
                { password: hashedPassword }
            )

            return {
                username: request.username
            }
            
        }        
    }
}