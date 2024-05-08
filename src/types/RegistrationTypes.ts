export type TUserAccount = {
    username: string
    password?: string
    otp: string
    otpSecret: string
    otpVerified: boolean
    csrfToken?: string
    profile?: {
        firstname: string
        lastname: string
        birthdate: Date
    }
}

export type TProfile = { firstname: string, lastname: string }