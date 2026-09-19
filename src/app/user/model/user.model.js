import { model, Schema } from "mongoose";

// user schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: function () {
            return this.provider === "local";
        }
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    });

// model

export const userModel = model("User", userSchema);