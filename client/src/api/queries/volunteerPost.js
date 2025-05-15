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

const deleteUserPost = async (postId) => {
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

export {deleteUserPost,getMapData,getPosts,getUserPosts,submitForm}