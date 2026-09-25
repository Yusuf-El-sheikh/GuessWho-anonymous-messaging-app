import * as authService from "../service/auth.service.js"

export async function registerUser(req, res, next) {
    try {
        const { name, email, password, provider } = req.body;
        const doc = await authService.registerUser(name, email, password, provider);
        res.status(201).json(doc);
    }
    catch (error) {
        next(error);
    }
}

export async function verifyAccount(req, res, next) {
    try {
        const { email, code } = req.body;
        const doc = await authService.verifyAccount(email, code);
        res.status(200).json({ message: "Your account has been verified successfully." });
    }
    catch (error) {
        next(error);
    }
}

export async function resendOTP(req, res, next) {
    try {
        const { email } = req.body;
        const doc = await authService.resendOTP(email);
        res.status(200).json(doc);
    }
    catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const {email, password} = req.body;
        const token = await authService.login(email, password);
        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 6 * 60 * 60 * 1000 
        }).status(200).json({message: "Logged in successfully"});
    } 
    catch (error) {
        next(error);    
    }
}