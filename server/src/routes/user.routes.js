import { Router } from "express";
import {
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  refreshTokens,
  changePassword,
  updateAccountDetails,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { loginSchema, userSchema } from "../../schema/UserSchema.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  validate(userSchema),
  registerUser
);

router.route("/login").post(validate(loginSchema), loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshTokens").post(refreshTokens);

router.route("/change-password").post(verifyJWT, changePassword);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);
 
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/user").get(verifyJWT, getUserDetails);

export default router;
