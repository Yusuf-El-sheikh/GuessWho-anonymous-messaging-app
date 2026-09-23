import crypto from "node:crypto";

export function generateOTP() {
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    return {code, expiresAt};
}