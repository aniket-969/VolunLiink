import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVolunteerData,
  getPosts,
  getPostData,
  volunteerForm,
  getNearestCoordinates,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { parseJsonFields, validate } from "../middlewares/validator.middleware.js";
import { formSchema } from "../../schema/FormSchema.js";

const router = Router();

router
  .route("/posts")
  .get(getPosts)
  .post(
    verifyJWT,
    upload.fields([{ name: "avatar" }]),
    parseJsonFields(["skills", "category"]),
    validate(formSchema),
    volunteerForm
  );

router.route("/posts/map").get(getNearestCoordinates);

router
  .route("/posts/:postId")
  .get(getPostData)
  .delete(verifyJWT, deleteVolunteerData);

export default router;
