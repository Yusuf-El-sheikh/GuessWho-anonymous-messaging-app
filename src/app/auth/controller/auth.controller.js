import * as authService from "../service/auth.service.js"

export async function registerUser(req, res, next) {
    try {
        const {name, email, password, provider} = req.body;
        const doc = await authService.registerUser(name, email, password, provider);
        res.status(201).json(doc);
    } 
    catch (error) {
        next(error);    
    }
}