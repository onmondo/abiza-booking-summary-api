import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().email().required(),
});

export const otpSchema = Joi.object({
    username: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
})

export const requestOtpSchema = Joi.object({
    username: Joi.string().email().required(),
})

export const passwordSchema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string()
        .min(8) // Minimum length of 8 characters (you can adjust this as needed)
        .pattern(new RegExp('^(?=.*[!@#$%^&*])')) // At least 1 symbol required
        .required(),
});

export const profileSchema = Joi.object({
    username: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthDate: Joi.date()
        .max('now')  // Ensure the birthdate is not in the future
        .iso()       // Allow ISO string format (e.g., "YYYY-MM-DD")
        .required(),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required()
})