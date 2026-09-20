import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { isStringObject } from "node:util/types";
import * as authRepository from "../repository/auth.repository.js";
import * as OTPRepository from "../repository/OTP.repository.js";
import * as nodeMailer from "../../common/nodemailer/nodemailer.js"

export async function registerUser(name, email, password, provider) {
    //  check if data is valid
    if (!name || !email || !password || !provider) {
        const error = new Error("Invalid action: Missing required data");
        error.status = 400;
        throw error;
    }
    if (typeof name !== "string"|| typeof email !== "string" || typeof password !== "string" || typeof provider !== "string") {
        const error = new Error("Invalid action: Data type mismatches requirements");
        error.status = 400;
        throw error;
    }

    //  check if user exists throw
    if (await authRepository.userExists(email)) {
        const error = new Error("Invalid action: This email is already registered");
        error.status = 400;
        throw error;
    }

    //  prepare data
    const hashedPassword = await bcrypt.hash(password, 10);
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; //expires after 5 mins

    //  insert user in database > isVerified is false by default
    const doc = await authRepository.createUser(name, email, hashedPassword);

    //  send OTP
    await OTPRepository.createOTP(email, code, expiresAt);

    await nodeMailer.sendEmail(
        email,
        "Verification code",
        `<h1>Your verification code is ${code}</h1>`
    )

    return doc;
}