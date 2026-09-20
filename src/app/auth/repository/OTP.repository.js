import { otpModel } from "../model/OTP.model.js"

export async function createOTP(email, code, expiresAt) {
    await otpModel.deleteMany({ email: email });
    await otpModel.create({ code: code, email: email, expiresAt: expiresAt });

    return code;
}