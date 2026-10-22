import {userModel} from "../model/user.model.js"

export async function getUserById(id){
    return await userModel.findById(id, {name: 1, email: 1, profilePicturePath: 1, isVerified: 1, isDeleted: 1, twoWayAuth: 1});
}

export async function updateProfilePicture(userId, filePath) {
    return await userModel.updateOne({_id: userId},{$set: {profilePicturePath: filePath}});
}