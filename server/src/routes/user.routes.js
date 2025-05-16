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
import { getUserVolunteerData } from "../controllers/post.controller.js";
const router = Router();

router.post(
  "/",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  validate(userSchema),
  registerUser
);

router.post("/login", validate(loginSchema), loginUser);

router.post("/logout", verifyJWT, logoutUser);

router.post("/refresh", refreshTokens);

router.patch("/password", verifyJWT, changePassword);

router.patch("/profile", verifyJWT, updateAccountDetails);

router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);

router.get("/me", verifyJWT, getUserDetails);
 
router.get("/me/posts", verifyJWT, getUserVolunteerData);


export default router;
