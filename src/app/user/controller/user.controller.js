import * as userService from "../service/user.service.js";

export async function updateProfilePicture(req, res, next) {
  try {
    const message = await userService.uploadProfilePicture(
      req.user.id,
      req.file.path,
    );
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
}
