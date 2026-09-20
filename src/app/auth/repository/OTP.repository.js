import { otpModel } from "../model/OTP.model.js"

export async function createOTP(email, code, expiresAt) {
    await otpModel.deleteMany({ email: email });
    await otpModel.create({ code: code, email: email, expiresAt: expiresAt });

    return code;
}

export async function checkOTPExists(email, code) {
    const codeExists = !! await otpModel.findOneAndDelete({ code: code, email: email });
    return codeExists
}