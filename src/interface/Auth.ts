export interface IUser {
    username: string
}

export interface IRegistration extends IUser {
    password: string
    otp: string
}

export interface IsProfile extends IUser {
    firstName: string
    lastName: string
    birthDate: string
}

export interface ILogin extends IUser {
    password: string
}