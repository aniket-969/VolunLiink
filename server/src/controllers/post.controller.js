import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";

const MAX_LIMIT = 50;

const volunteerForm = asyncHandler(async (req, res) => {
  try {
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

    console.log("This is vol body", req.body);

    const createdBy = req.user?._id;
    console.log("user id", createdBy);

    console.log(req.files);
    const volunteerLocalPaths = req.files?.avatar?.map((file) => file.path);

    if (!volunteerLocalPaths || volunteerLocalPaths.length === 0) {
      throw new ApiError(400, "At least one volunteer local file is required");
    }

    const avatar = await Promise.all(
      volunteerLocalPaths.map((path) => uploadOnCloudinary(path))
    );
    console.log("This is avatar here 37", avatar);

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    const imageUrls = avatar.map((image) => image.url);
    console.log("URL", imageUrls);
    const cleanedStartDate = req.body.startDate
      ? new Date(req.body.startDate)
      : undefined;

    const cleanedEndDate = req.body.endDate
      ? new Date(req.body.endDate)
      : undefined;

    const VolunteerData = await Post.create({
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
      startDate: cleanedStartDate,
      endDate: cleanedEndDate,
      images: imageUrls,
      role,
      skills: skills
        ? [{ skillName: skills.skillName, description: skills.description }]
        : undefined,
      category: category
        ? [
            {
              categoryName: category.categoryName,
              description: category.description,
            },
          ]
        : undefined,
      createdBy,
    });
    console.log("Vol", VolunteerData);
    return res.json(
      new ApiResponse(
        201,
        VolunteerData,
        "Volunteer form submitted successfully"
      )
    );
  } catch (error) {
    console.log(error);
    return res.json(new ApiError(401, error, "Error while creating post"));
  }
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
    filter["skills.skillName"] = skillName;
  }

  if (categoryName) {
    filter["category.categoryName"] = categoryName;
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

  const posts = await Post.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "username fullName")
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
  console.log("This is userid", userId);
  const skip = (page - 1) * limit;
  const userPosts = await Post.find({ createdBy: userId })
    .skip(skip)
    .populate("createdBy", "username fullName")
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
  const { postId } = req.params;
  console.log(postId);

  const postData = await Post.findOne({ _id: postId })
    .populate("createdBy", "username fullName")
    .exec();
  if (!postData) throw new ApiError(400, "Post not found");
  console.log(postData);

  return res.json(
    new ApiResponse(200, postData, "Post details retrieved successfully")
  );
});

const deleteVolunteerData = asyncHandler(async (req, res) => {
  const deletedPost = await Post.findByIdAndDelete(req.params.postId);
  if (!deletedPost) {
    throw new ApiError(404, "Post not found");
  }
  return res.json(new ApiResponse(200, {}, "Post deleted successfully"));
});

const getNearestCoordinates = asyncHandler(async (req, res) => {
  console.log(req.query);
  const { latitude, longitude } = req.query;
  let filter = {};
  filter.location = {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    },
  };

  const posts = await Post.find(filter);

  console.log("This is posts", posts);
  const response = posts.map((post) => ({
    role: post.role,
    geocode: [post.location.coordinates[0], post.location.coordinates[1]],
    postId: post._id,
  }));

  return res.json(
    new ApiResponse(200, response, "Data for map retrieved successfully")
  );
});

export {
  volunteerForm,
  getUserVolunteerData,
  getPosts,
  deleteVolunteerData,
  getPostData,
  getNearestCoordinates,
};
