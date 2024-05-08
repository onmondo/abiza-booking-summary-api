import mongoose from "mongoose";

export const userAccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: String,
    otp: String,
    otpSecret: String,
    otpVerified: Boolean,
    csrfToken: String,
    profile: {
        firstname: String,
        lastname: String,
        birthdate: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: Date,
});

export default mongoose.model("UserAccount", userAccountSchema);

