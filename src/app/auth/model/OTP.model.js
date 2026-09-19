import { model, Schema } from "mongoose"

// OTP schema

const otpSchema = new Schema({
    code: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    expiresAt: {
        type: Date, 
        required: true,
        index: {expireAfterSeconds: 0}
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

// OTP model

export const otpModel = model("OTP", otpSchema);