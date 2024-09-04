import { Router } from "express";
import { upload } from "./../middlewares/multer.middleware.js";

import {
  deleteVolunteerData,
  getPosts,
  getUserVolunteerData,
  getPostData,
  volunteerForm,
} from "../controllers/volunteer.controller.js";
import { skillForm } from "../controllers/skills.controller.js";
import { OpportunityCategoryForm } from "../controllers/organisation.controller.js";

const router = Router();

router.route("/volunteer-form").post(
  upload.fields([
    {
      name: "avatar",
    },
  ]),
  volunteerForm
);

router.route("/posts").get(getPosts)
router.route("/volunteer/:userId").get(getUserVolunteerData);

router.route("/volunteer/post/:postId").get(getPostData);

router.route("/skill-form").post(upload.none(), skillForm);

router
  .route("/opportunity-category")
  .post(upload.none(), OpportunityCategoryForm);

router.delete("/volunteers/:id", deleteVolunteerData);
export default router