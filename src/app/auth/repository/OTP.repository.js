import { otpModel } from "../model/OTP.model"

export async function generateOTP(email, code, expiresAt) {
    await otpModel.deleteMany({ email: email });
    await otpModel.create({ code: code, email: email, expiresAt: expiresAt });

    return code;
}