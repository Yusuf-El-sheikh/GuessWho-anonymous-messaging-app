import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyGoogleToken,
} from "../utils/auth.utils.js";
import { generateOTP } from "../utils/OTP.utils.js";
import * as authRepository from "../repository/auth.repository.js";
import * as OTPRepository from "../repository/OTP.repository.js";
import * as nodeMailer from "../../common/nodemailer/nodemailer.js";
import { AppError } from "../../common/error/app.error.js";

export async function registerUser(name, email, password) {
  //  check if user exists throw
  if (await authRepository.userExists(email)) {
    throw new AppError("Invalid action: This email is already registered", 409);
  }

  //  prepare data
  const hashedPassword = await hashPassword(password);
  const { code, expiresAt } = generateOTP();

  //  insert user in database > isVerified is false by default
  const doc = await authRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });

  //  save OTP in db
  await OTPRepository.createOTP(email, code, expiresAt);

  // send the otp to email
  await nodeMailer.sendEmail(
    email,
    "Verification code",
    `<h1>Your verification code is ${code}</h1>`,
  );

  return doc;
}

export async function verifyAccount(email, code) {
  //check user exists
  if (!(await authRepository.userExists(email))) {
    throw new AppError("Invalid action: Invalid credentials", 401);
  }

  //check code exists in db (boolean return)
  if (!(await OTPRepository.checkOTPExists(email, code))) {
    throw new AppError("Invalid action: The code you entered is wrong", 400);
  }

  //update email isVerified to true
  const doc = await authRepository.updateIsVerified(email);

  if (doc.modifiedCount == 0) {
    throw new AppError("Invalid action: Account not found", 404);
  }

  return doc;
}

export async function resendOTP(email) {
  //check email exists
  if (!(await authRepository.userExists(email))) {
    throw new AppError("Invalid action: Invalid credentials", 401);
  }

  //check isVerified is true
  if (await authRepository.checkIsVerified(email)) {
    throw new AppError("Invalid action: Invalid request", 409);
  }

  //create OTP
  const { code, expiresAt } = generateOTP();

  await OTPRepository.createOTP(email, code, expiresAt);

  //resend it via mail
  await nodeMailer.sendEmail(
    email,
    "Verification code",
    `<h1>Your verification code is ${code}</h1>`,
  );

  return { message: "Verification code sent to your mailbox" };
}

export async function login(email, password) {
  //check user exists
  if (!(await authRepository.userExists(email))) {
    throw new AppError("Invalid action: Invalid credentials", 401);
  }

  //check password
  const user = await authRepository.getUser(email);
  if(typeof user.password === "undefined"){
    throw new AppError("Invalid action: Invalid credentials", 401);
  }
  if (!(await comparePassword(password, user.password))) {
    throw new AppError("Invalid action: Invalid credentials", 401);
  }

  //check if user is not verified
  if (!(await authRepository.checkIsVerified(email))) {
    throw new AppError("Invalid action: Account not verified", 403);
  }

  //generate token and  send it on cookie
  const token = generateToken({
    id: user._id,
    email: user.email,
    name: user.name,
  });

  return token;
}

export async function loginWithGoogle(idToken) {
  //verify idToken
  const payload = await verifyGoogleToken(idToken);

  //if user exists create token
  const user = await authRepository.getUser(payload.email);
  if (user) {
    return generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
  }

  //if user does not exist create then make token
  const generatedUser = await authRepository.createUser({
    name: payload.name,
    email: payload.email,
    isVerified: true,
    provider: "google",
  });

  return generateToken({
      id: generatedUser._id,
      email: generatedUser.email,
      name: generatedUser.name,
    });
}

export async function resetPassword(code, email, newPassword) {
  //resend otp already validates data and sends otp so its front end job to redirect the pages

  //check email exists
  if (!(await authRepository.userExists(email))) {
    throw new AppError("Invalid action: Invalid credentials", 401);
  }

  //check otp exists
  if (!(await OTPRepository.checkOTPExists(email, code))) {
    throw new AppError("Invalid action: The code you entered is wrong", 400);
  }
  //if both are true update password and return success

  const hashedPassword = await hashPassword(newPassword);

  if (
    (await authRepository.updatePassword(email, hashedPassword))
      .modifiedCount === 0
  ) {
    throw new AppError("Invalid action: Invalid credentials", 401);
  }

  return { message: "Your password was reset successfully" };
}
