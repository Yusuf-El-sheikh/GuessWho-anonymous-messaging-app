import * as userRepository from "../repository/user.repository.js";
import { AppError } from "../../../lib/error/app.error.js";
import { logger } from "../../../pkg/logger/logger.js";
import fs from "fs/promises";

export async function uploadProfilePicture(userId, filePath) {
  //get user old profile picture using user id by auth guard
  const user = await userRepository.getUserById(userId);

  if(!user){
    throw new AppError("Invalid action: User not found", 404);
  }

  //update profile picture path in the model
  const update = await userRepository.updateProfilePicture(userId, filePath);

  if (user.profilePicturePath === undefined) {
    return { message: "Profile picture updated successfully" };
  }

  //only then delete the old profile picture (if there was any)
  try {
    await fs.unlink(user.profilePicturePath);
  } catch (error) {
    logger.error(
      `Delete action failure: file is either already deleted or orphaned - ${user.profilePicturePath}`,
      { stack: error.stack },
    );
  }
  return { message: "Profile picture updated successfully" };
}
