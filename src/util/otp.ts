import { authenticator } from 'otplib';

export function generateOtp() {
    const secret = authenticator.generateSecret();    
    const expectedOTP = authenticator.generate(secret);

    return {
        secret,
        expectedOTP
    }
}
