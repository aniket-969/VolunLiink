// api/queries/volunteerPost.js
import axios from "axios";
import toast from "react-hot-toast";

const basePath = "http://localhost:9000/api/v1/volunteers/posts";

export const submitForm = async (data) => {
  try {
    const response = await axios.post(`${basePath}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error.response;
  }
};

export const getPosts = async (page = 1, limit = 5, filter = {}) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
      ...filter,
    });
    const response = await axios.get(`${basePath}?${params.toString()}`);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
  }
};

export const getMapData = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({ latitude, longitude });
    const response = await axios.get(`${basePath}/map?${params.toString()}`);
    if (response.data.success) {
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching map data", error);
    throw error;
  }
};

export const getUserPosts = async () => {
  try {
    const response = await axios.get(`${basePath}/user`, {
      withCredentials: true,
    });

    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching user data", error.response?.data);
    throw error.response;
  }
};

export const deleteUserPost = async (postId) => {
  try {
    const data = await axios.delete(`${basePath}/${postId}`, {
      withCredentials: true,
    });
    return data.data;
  } catch (error) {
    console.error("Error deleting post", error);
    throw error;
  }
};
