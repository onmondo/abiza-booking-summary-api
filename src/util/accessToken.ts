import jwt from "jsonwebtoken"

export function generateAccessToken(creds: { username: string, secret: string}, maxAge: number) {
    return jwt.sign(
        { 
            username: creds.username 
        }, 
        creds.secret, 
        {
            expiresIn: maxAge // in seconds
        }
    )
}