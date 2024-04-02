import { ILogin } from "../interface/Auth";
import { TUserAccount } from "../types/RegistrationTypes";
import { generateAccessToken } from "../util/accessToken";
import { envKeys } from "../util/config";
import Registration from "./Registration";
import bcrypt from "bcrypt";

export default class User {
    static v1 = class v1 {
        static async login(request: ILogin): Promise<string | unknown> {
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
            }, 60);
        
            return accessToken;
        }
    }
}