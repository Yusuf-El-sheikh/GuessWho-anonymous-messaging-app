import { model, Schema } from "mongoose";

// message schema

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    reciever: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        minlength: 1,
        maxlength: 500,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

// message model

export const messageModel = model("Message", messageSchema);