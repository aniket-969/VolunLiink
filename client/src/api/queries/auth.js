// api/queries/auth.js
import axios from "axios";
import toast from "react-hot-toast";

const basePath = "http://localhost:9000/api/v1/users";

export const refreshTokens = async () => {
  try {
    const response = await axios.post(`${basePath}/refresh`, {}, {
      withCredentials: true,
    });

    if (response.data.success) {
      return response.data.data;
    }

    if (response.data.statusCode === 401) {
      throw new Error("Unauthorized");
    }

    return null;
  } catch (error) {
    console.error(error.response?.data);
    throw error.response;
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${basePath}/login`, formData, {
      withCredentials: true,
    });

    if (response.data.success) {
      toast.success("Logged in successfully");
      return response.data;
    }
  } catch (error) {
    console.error(error.response.data);
    toast.error(error.response.data.message || "Login failed");
    throw error.response;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(`${basePath}/logout`, {}, {
      withCredentials: true,
    });

    if (response.data.success) {
      toast.success("Logged out successfully");
      return response.data;
    }
  } catch (error) {
    console.error(error.response?.data);
    toast.error("Logout failed");
    throw error.response;
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${basePath}`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      toast.success("Registered successfully");
      return response.data;
    }
  } catch (error) {
    console.error(error.response.data);
    toast.error(error.response.data.message || "Registration failed");
    throw error.response;
  }
};
