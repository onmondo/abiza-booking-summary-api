import { ILogin, ILoginTokens, IRefreshToken } from "../interface/Auth";
import { TUserAccount } from "../types/RegistrationTypes";
import { generateAccessToken, generateRefreshToken } from "../util/accessToken";
import { envKeys } from "../util/config";
import Registration from "./Registration";
import bcrypt from "bcrypt";
import Guest from "./Guest";

export default class User {
    static v1 = class v1 {
        static async login(request: ILogin): Promise<ILoginTokens | unknown> {
            // get user account details
            const result = await Registration.v1.getUserAccount(request.username)
        
            if (!result) {
                throw new Error('User does not exist.')
            }
        
            const userAccount = result as TUserAccount;
            // compare password
            const compareResult = await bcrypt.compare(request.password, userAccount.password || "")
            if (!compareResult) {
                throw new Error("Wrong username or password");
            }
        
            // create access token
            const accessToken = generateAccessToken({
                username: userAccount.username,
                secret: envKeys().AUTHORIZER_SECRET_KEY
            }, 60); // expires in 60 seconds

            const refreshToken = generateRefreshToken({
                username: userAccount.username,
                secret: envKeys().REFRESHER_SECRET_KEY
            }, 432000); // expires in 5 days

            // Produce CSRF token here for presistence
            const guest = new Guest()
            const csrfToken = await guest.generateCSRF(userAccount.username)

            return {
                accessToken,
                refreshToken,
                csrfToken,
            };
        }

        static async refreshToken(request: IRefreshToken): Promise<ILoginTokens | unknown> {
            // get user account details
            const result = await Registration.v1.getUserAccount(request.username)

            if (!result) {
                throw new Error('User does not exist.')
            }
        
            const userAccount = result as TUserAccount;
            // create access token
            const accessToken = generateAccessToken({
                username: userAccount.username,
                secret: envKeys().AUTHORIZER_SECRET_KEY
            }, 60); // expires in 60 seconds

            const refreshToken = generateRefreshToken({
                username: userAccount.username,
                secret: envKeys().REFRESHER_SECRET_KEY
            }, 432000); // expires in 5 days

            return {
                accessToken,
                refreshToken
            };
        }
    }
}