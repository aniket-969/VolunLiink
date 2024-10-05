import axios from "axios";
import toast from "react-hot-toast";

const submitForm = async (data) => {
  console.log(data);
  try {
    const response = await axios.post(
      "http://localhost:9000/api/v1/volunteers/volunteer-form",
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    throw error.response;
  }
};

const submitSkillForm = async (skillName, skillDescription) => {
  try {
    const formData = {
      skillName: skillName,
      description: skillDescription,
    };

    const response = await axios.post(
      "http://localhost:9000/api/v1/volunteers/skill-form",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data.data._id; // Adjust according to your API response structure
  } catch (error) {
    console.error(error.response.data.message);
    throw error.response;
  }
};

const submitCategoryForm = async (categoryName, categoryDescription) => {
  try {
    const formData = {
      categoryName: categoryName,
      description: categoryDescription,
    };

    console.log(formData);
    const response = await axios.post(
      "http://localhost:9000/api/v1/volunteers/opportunity-category",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data.data._id; // Adjust according to your API response structure
  } catch (error) {
    console.error(error.response.data.message);
    throw error.response;
  }
};

const getPosts = async (page = 1, limit = 5, filter = {}) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
      ...filter,
    });
    const response = await axios.get(
      `http://localhost:9000/api/v1/volunteers/posts?${params.toString()}`
    );
    if (response.data.success) {
      // console.log(response.data);

      return response.data.data;
    }
    return [];
  } catch (error) {
    console.log(error, "Error fetching posts");
    throw error;
  }
};

const getMapData = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({ latitude, longitude });
    const response = await axios.get(
      `http://localhost:9000/api/v1/volunteers/map-location?${params.toString()}`
    );
    // console.log(response);
    if (response.data.success) {
      return response.data.data || [];
    } 
    return [];
  } catch (error) {
    console.error("Error fetching map data", error);
    throw error;
  }
};

const getUserPosts = async () => {
  try {
    const response = await axios.get(
      `http://localhost:9000/api/v1/volunteers/userPost`,
      { withCredentials: true }
    );

    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.log(error.response.data, "There was an error fetching user data");
    throw error.response;
  }
};

const updateUserProfile = async (data) => {
  try {
    const response = await axios.patch(
      "http://localhost:9000/api/v1/users/update-account",
      data,
      { withCredentials: true }
    );
    console.log(response);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error(error.response.data);
    throw error.response;
  }
};

const updateUserAvatar = async (data) => {
  try {
    const response = await axios.patch(
      "http://localhost:9000/api/v1/users/avatar",
      data,
      { withCredentials: true }
    );
    console.log(response);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error(error.response.data);
    throw error.response;
  }
};

const updateUserPassword = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:9000/api/v1/users/change-password",
      data,
      { withCredentials: true }
    );
    console.log(response);
    if (response.data.success) {
      toast.success(response.data.message);
    } 
    return;
  } catch (error) {
    console.error(error.response.data);
    toast.error(error.response.data.message || "Error updating password");
    throw error.response;
  }
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-based
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
  return `${day}/${month}/${year}`;
}

function formatUpdatedAt(updatedAt) {
  // console.log(updatedAt);

  const updatedAtDate = new Date(updatedAt);
  // console.log(updatedAtDate);

  const now = new Date();
  const diffMilliseconds = now - updatedAtDate;

  const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

  // console.log(diffMinutes);

  if (diffMinutes < 1) {
    return "Just now";
  } else if (diffMinutes === 1) {
    return "1 minute ago";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffMinutes < 1440) {
    // Less than 24 hours
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours} hours ago`;
  } else {
    const diffDays = Math.floor(diffMinutes / 1440);
    return `${diffDays} days ago`;
  }
}

const handlePostDelete = async (postId) => {
  try {
    console.log(postId);

    const data = await axios.delete(
      `http://localhost:9000/api/v1/volunteers/${postId}`,
      {
        withCredentials: true,
      }
    );
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  submitForm,
  submitSkillForm,
  submitCategoryForm,
  getPosts,
  getMapData,
  getUserPosts,
  formatDate,
  formatUpdatedAt,
  handlePostDelete,
  updateUserProfile,
  updateUserAvatar,
  updateUserPassword,
};
