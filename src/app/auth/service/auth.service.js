import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { isStringObject } from "node:util/types";
import * as authRepository from "../repository/auth.repository.js";
import * as OTPRepository from "../repository/OTP.repository.js";
import * as nodeMailer from "../../common/nodemailer/nodemailer.js"
import { otpModel } from "../model/OTP.model.js";

export async function registerUser(name, email, password, provider) {
    //  check if data is valid
    if (!name || !email || !password || !provider) {
        const error = new Error("Invalid action: Missing required data");
        error.status = 400;
        throw error;
    }
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || typeof provider !== "string") {
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

    //  save OTP in db
    await OTPRepository.createOTP(email, code, expiresAt);

    // send the otp to email
    await nodeMailer.sendEmail(
        email,
        "Verification code",
        `<h1>Your verification code is ${code}</h1>`
    )

    return doc;
}

export async function verifyAccount(email, code) {
    //check if data is valid
    if (!email || !code) {
        const error = new Error("Invalid action: Missing required data");
        error.status = 400;
        throw error;
    }
    if (typeof email !== "string" || typeof code !== "string") {
        const error = new Error("Invalid action: Data type mismatches requirements");
        error.status = 400;
        throw error;
    }

    //check user exists
    if (!await authRepository.userExists(email)) {
        const error = new Error("Invalid action: This account doesn't exist");
        error.status = 400;
        throw error;
    }

    //check code exists in db (boolean return)
    if (!await OTPRepository.checkOTPExists(email, code)) {
        const error = new Error("Invalid action: The code you entered is incorrect");
        error.status = 400;
        throw error;
    }

    //update email isVerified to true
    const doc = await authRepository.updateIsVerified(email);

    if (doc.modifiedCount == 0) {
        const error = new Error("Invalid action: The email you tried to verify no longer exist");
        error.status = 400;
        throw error;
    }

    return doc;
}

export async function resendOTP(email) {
    //check data is valid
    if (!email) {
        const error = new Error("Invalid action: Missing required data");
        error.status = 400;
        throw error;
    }
    if (typeof email !== "string") {
        const error = new Error("Invalid action: Data type mismatches requirements");
        error.status = 400;
        throw error;
    }

    //check email exists
    if (!await authRepository.userExists(email)) {
        const error = new Error("Invalid action: Account isn't registered, register first to get your OTP code");
        error.status = 400;
        throw error;
    }

    //check isVerified is true
    if (await authRepository.checkIsVerified(email)) {
        const error = new Error("Invalid action: Account is already verified");
        error.status = 400;
        throw error;
    }

    //create OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; //expires after 5 mins

    await OTPRepository.createOTP(email, code, expiresAt);

    //resend it via mail
    await nodeMailer.sendEmail(email,
        "Verification code",
        `<h1>Your verification code is ${code}</h1>`
    )

    return { message: "OTP sent to your mailbox" };
}