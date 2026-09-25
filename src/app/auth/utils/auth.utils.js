import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(incomingPassword, userPassword) {
    return await bcrypt.compare(incomingPassword, userPassword);
}

export function generateToken(payload) {
    return jwt.sign(payload, process.env.SECRET_TOKEN_KEY, {
        expiresIn: "6h"
    });
}