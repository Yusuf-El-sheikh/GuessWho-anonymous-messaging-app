import {userModel} from "../model/user.model.js"

export async function getUserById(id){
    return await userModel.findById(id);
}