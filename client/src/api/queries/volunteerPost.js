import axios from "axios";

const basePath = "http://localhost:9000/api/v1/volunteers/posts";
 
export const submitForm = async (data) => {
  try {
    const response = await axios.post(
      `${basePath}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error.response?.data);
    throw error.response;
  }
};

export const getPosts = async (page = 1, limit = 5, filter = {}) => {
  console.log(filter)
  try {
    const params = new URLSearchParams({ page, limit, ...filter });
    const response = await axios.get(
      `${basePath}?${params.toString()}`
    );
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching posts", error);
    throw error;
  }
};

export const getMapData = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({ latitude, longitude });
    const response = await axios.get(
      `${basePath}/map?${params.toString()}`
    );
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching map data", error);
    throw error;
  }
};

export const getUserPosts = async () => {
  try {
    
    const response = await axios.get(
      "http://localhost:9000/api/v1/users/me/posts",
      { withCredentials: true }
    );
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Error fetching user posts", error.response?.data);
    throw error.response;
  }
};

export const deleteUserPost = async (postId) => {
  try {
    const response = await axios.delete(
      `${basePath}/${postId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting post", error);
    throw error;
  }
};
