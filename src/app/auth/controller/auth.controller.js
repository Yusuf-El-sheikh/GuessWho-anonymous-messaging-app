import * as authService from "../service/auth.service.js";
import { validateBody } from "../../common/validation/validation.js";
import { loginDTO, registerDTO, resetPasswordDTO, sendDTO, verifyAccountDTO } from "../dto/auth.dto.js";

export async function registerUser(req, res, next) {
  try {
    const { name, email, password, provider } = validateBody(registerDTO, req.body);
    const doc = await authService.registerUser(name, email, password, provider);
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
}

export async function verifyAccount(req, res, next) {
  try {
    const { email, code } = validateBody(verifyAccountDTO, req.body);
    await authService.verifyAccount(email, code);
    res
      .status(200)
      .json({ message: "Your account has been verified successfully." });
  } catch (error) {
    next(error);
  }
}

export async function resendOTP(req, res, next) {
  try {
    const { email } = validateBody(sendDTO, req.body);
    const message = await authService.resendOTP(email);
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = validateBody(loginDTO, req.body);
    const token = await authService.login(email, password);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 6 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Logged in successfully" });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { email, code, newPassword } = validateBody(resetPasswordDTO, req.body);
    const message = await authService.resetPassword(code, email, newPassword);
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
}
