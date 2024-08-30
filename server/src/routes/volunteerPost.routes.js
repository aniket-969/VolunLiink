import { Router } from "express";
import { upload } from "./../middlewares/multer.middleware.js";

import {
  deleteVolunteerData,
  getAllVolunteers,
  getNearestData,
  getOpportunityDataOnly,
  getOrganisationCategoryData,
  getPostData,
  getUserVolunteerData,
  getVolunteerDataByDate,
  getVolunteerDataBySkill,
  getVolunteerDataOnly,
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
    
  router.route("/volunteers").get(getAllVolunteers);
  
  router.route("/volunteer/:userId").get(getUserVolunteerData);
  
  router.route("/volunteer/post/:postId").get(getPostData);
  
  router.route("/volunteer/location/:latitude/:longitude").get(getNearestData);
  
  router.route("/skillData").get(getVolunteerDataBySkill);
  
  router.route("/latestData").get(getVolunteerDataByDate);
  
  router.route("/opportunityData").get(getOrganisationCategoryData);
  
  router.route("/opportunityDataOnly").get(getOpportunityDataOnly);
  router.route("/volunteerDataOnly").get(getVolunteerDataOnly);
  
  router.route("/skill-form").post(upload.none(), skillForm);
  
  router
    .route("/opportunity-category")
    .post(upload.none(), OpportunityCategoryForm);
  
  router.delete('/volunteers/:id',deleteVolunteerData)
  
