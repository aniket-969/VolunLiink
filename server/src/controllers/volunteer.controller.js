import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { VolunteerOpportunity } from "./../models/volunteers.model.js";
import { Skills } from "../models/skills.model.js";
import { OpportunityCategory } from "../models/opportunityCategory.model.js";

const MAX_LIMIT = 50;

const volunteerForm = asyncHandler(async (req, res) => {
  const {
    title,
    latitude,
    longitude,
    description,
    contactEmail,
    contactPhone,
    startDate,
    endDate,
    role,
    country,
    county,
    road,
    state,
    village,
    skills,
    category,
  } = req.body;

  console.log(req.body);
  const createdBy = req.user?._id;

  if (
    [title, description, contactEmail, startDate, endDate, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  console.log(req.files);
  const volunteerLocalPaths = req.files?.avatar?.map((file) => file.path);
  // const volunteerLocalPaths = req.files?.avatar[0]?.path

  if (!volunteerLocalPaths || volunteerLocalPaths.length === 0) {
    throw new ApiError(400, "At least one volunteer local file is required");
  }

  const avatar = await Promise.all(
    volunteerLocalPaths.map((path) => uploadOnCloudinary(path))
  );
  console.log("This is avatar here 37", avatar);

  // const avatar = await uploadOnCloudinary(volunteerLocalPaths)

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const imageUrls = avatar.map((image) => image.url);
  console.log(imageUrls);

  const VolunteerData = await VolunteerOpportunity.create({
    title,
    description,
    location: {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
      country,
      county,
      road,
      state,
      village,
    },
    contactEmail,
    contactPhone,
    startDate,
    endDate,
    images: imageUrls,
    role,
    skills,
    category,
    createdBy,
  });

  return res.json(
    new ApiResponse(201, VolunteerData, "Volunteer form submitted successfully")
  );
});

const getPosts = asyncHandler(async (req, res) => {
  const {
    postId,
    latitude,
    longitude,
    skillName,
    categoryName,
    role,
    sort,
    dateFilter,
  } = req.query;
  let { page = 1, limit = 5 } = req.query;

  let filter = {};
  let sortOptions = {};

  limit = Math.min(MAX_LIMIT, limit);

  if (postId) {
    filter._id = postId;
  }

  if (latitude && longitude) {
    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      },
    };
  }

  if (skillName) {
    const skills = await Skills.find({ skillName }).select("_id");
    if (skills.length > 0) {
      const skillIds = skills.map((skill) => skill._id);
      filter.skills = { $in: skillIds };
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(200, [], "No posts found for the given skillName")
        );
    }
  }

  if (categoryName) {
    const opportunity = await OpportunityCategory.find({ categoryName }).select(
      "_id"
    );

    if (opportunity.length > 0) {
      const opportunityIds = opportunity.map((opp) => opp._id);
      filter.category = { $in: opportunityIds };
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(200, [], "No posts found for the given Opportunity")
        );
    }
  }

  if (role) {
    filter.role = role;
  }

  if (sort) {
    const [key, order] = sort.split(":");
    sortOptions[key] = order === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1;
  }

  if (dateFilter) {
    const { startDate, endDate } = dateFilter;
    if (startDate)
      filter.createdAt = { ...filter.createdAt, $gte: new Date(startDate) };
    if (endDate)
      filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
  }

  const skip = (page - 1) * limit;


  const posts = await VolunteerOpportunity.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "username fullName")
    .populate("category", "categoryName description")
    .populate("skills", "skillName description")
    .exec();
  return res.json(
    new ApiResponse(200, posts, "All volunteers fetched successfully")
  );
});

const getUserVolunteerData = asyncHandler(async (req, res) => {
  const { sort } = req.query;
  let { page = 1, limit = 5 } = req.query;

  let sortOptions = {};

  limit = Math.min(MAX_LIMIT, limit);
  if (sort) {
    const [key, order] = sort.split(":");
    sortOptions[key] = order === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1;
  }

  const userId = req.user?._id;

  const skip = (page - 1) * limit;
  const userPosts = await VolunteerOpportunity.find({ createdBy: userId })
    .skip(skip)
    .populate("createdBy", "username fullName")
    .populate("skills", "skillName description")
    .sort(sortOptions);

  if (!userPosts || userPosts.length == 0) {
    return res.json({
      message: "No volunteer opportunities found for the user",
    });
  }

  return res.json(
    new ApiResponse(200, userPosts, "User posts fetched successfully")
  );
});

const getPostData = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(postId);

    const postData = await VolunteerOpportunity.findOne({ _id: postId })
      .populate("createdBy", "username fullName")
      .populate("skills", "skillName description")
      .populate("category", "categoryName description")
      .exec();

    console.log(postData);

    return res.json(
      new ApiResponse(200, postData, "Post details retrieved successfully")
    );
  } catch (error) {
    console.log(error);
    return res.json(
      new ApiResponse(
        500,
        null,
        "Internal Server Error: Unable to retrieve nearest volunteer opportunities"
      )
    );
  }
});

const deleteVolunteerData = asyncHandler(async (req, res) => {
  const deletedVolunteer = await VolunteerOpportunity.findByIdAndDelete(
    req.params.id
  );
  if (!deletedVolunteer) {
    return res.status(404).json({ message: "Volunteer not found" });
  }
  res.json({ message: "Volunteer deleted successfully" });
});

export {
  volunteerForm,
  getUserVolunteerData,
  getPosts,
  deleteVolunteerData,
  getPostData,
};
