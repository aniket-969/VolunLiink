// api/queries/user.js
import axios from "axios";
import toast from "react-hot-toast";

const basePath = "http://localhost:9000/api/v1/users";


export const fetchUserDetails = async () => {
  try {
    const response = await axios.get(
      `${basePath}/me`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error.response?.data);
    throw error.response;
  }
};


export async function fetchLocationDetails(latitude, longitude, apiKey) {
  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&pretty=1`
    );
    const data = await res.json();
    if (data.results.length > 0) {
      return {
        formattedAddress: data.results[0].formatted,
        components: data.results[0].components,
        geometry: data.results[0].geometry,
      };
    } else {
      return { error: "Address not found" };
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return { error: "Error fetching address" };
  }
}


export const updateUserProfile = async (data) => {
  try {
    const response = await axios.patch(
      `${basePath}/profile`,
      data,
      { withCredentials: true }
    );
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error(error.response?.data);
    throw error.response;
  }
};


export const updateUserAvatar = async (data) => {
  try {
    const response = await axios.patch(
      `${basePath}/avatar`,
      data,
      { withCredentials: true }
    );
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error(error.response?.data);
    throw error.response;
  }
};


export const updateUserPassword = async (data) => {
  try {
    const response = await axios.patch(
      `${basePath}/password`,
      data,
      { withCredentials: true }
    );
    if (response.data.success) {
      toast.success(response.data.message);
    }
  } catch (error) {
    console.error(error.response?.data);
    toast.error(error.response?.data?.message || "Error updating password");
    throw error.response;
  }
};
