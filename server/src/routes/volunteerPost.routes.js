import { Router } from "express";
import { upload } from "./../middlewares/multer.middleware.js";

import {
  deleteVolunteerData,
  getPosts,
  getUserVolunteerData,
  getPostData,
  volunteerForm,
  getNearestCoordinates,
} from "../controllers/volunteer.controller.js";
import { skillForm } from "../controllers/skills.controller.js";
import { OpportunityCategoryForm } from "../controllers/organisation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from './../middlewares/validator.middleware.js';
import { formSchema } from "../../schema/FormSchema.js";

const router = Router();

router.route("/volunteer-form").post(verifyJWT,
  upload.fields([
    {
      name: "avatar",
    },
  ]),
  validate(formSchema),
  volunteerForm
);
router.route("/map-location").get(getNearestCoordinates)
router.route("/posts").get(getPosts)
router.route("/userPost").get(verifyJWT,getUserVolunteerData);

router.route("/post/:postId").get(getPostData);

router.delete("/:id",verifyJWT, deleteVolunteerData);
export default router