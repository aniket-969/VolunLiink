import { Router } from "express";
import {
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  refreshTokens
} from "../controllers/user.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshTokens").post(refreshTokens)

router.route("/user").get(getUserDetails);


export default router;
