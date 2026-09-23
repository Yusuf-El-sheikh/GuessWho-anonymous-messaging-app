import bcrypt from "bcrypt";
import crypto from "node:crypto";
import * as authRepository from "../repository/auth.repository.js";
import * as OTPRepository from "../repository/OTP.repository.js";
import * as nodeMailer from "../../common/nodemailer/nodemailer.js";
import {AppError} from "../../common/error/app.error.js";

export async function registerUser(name, email, password, provider) {
    //  check if data is valid
    if (!name || !email || !password || !provider) {
        throw new AppError("Invalid action: Missing required data", 400);
    }
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || typeof provider !== "string") {
        throw new AppError("Invalid action: Data type mismatch", 400);
    }

    //  check if user exists throw
    if (await authRepository.userExists(email)) {
        throw new AppError("Invalid action: This email is already registered", 409);
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
        throw new AppError("Invalid action: Missing required data", 400);
    }
    if (typeof email !== "string" || typeof code !== "string") {
        throw new AppError("Invalid action: Data type mismatch", 400);
    }

    //check user exists
    if (!await authRepository.userExists(email)) {
        throw new AppError("Invalid action: email not found", 404);
    }

    //check code exists in db (boolean return)
    if (!await OTPRepository.checkOTPExists(email, code)) {
        throw new AppError("Invalid action: The code you entered is wrong", 400);
    }

    //update email isVerified to true
    const doc = await authRepository.updateIsVerified(email);

    if (doc.modifiedCount == 0) {
        throw new AppError("Invalid action: Can't verify, email not found", 404);
    }

    return doc;
}

export async function resendOTP(email) {
    //check data is valid
    if (!email) {
        throw new AppError("Invalid action: Missing required data", 400);
    }
    if (typeof email !== "string") {
        throw new AppError("Invalid action: Data type mismatch", 400);
    }

    //check email exists
    if (!await authRepository.userExists(email)) {
        throw new AppError("Invalid action: Can't send code, email not found", 404);
    }

    //check isVerified is true
    if (await authRepository.checkIsVerified(email)) {
        throw new AppError("Invalid action: Account is already verified", 400);
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