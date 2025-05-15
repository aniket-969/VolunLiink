import axios from "axios";

const fetchUserDetails = async (userId) => {
  try {
    const userData = await axios.get(
      `http://localhost:9000/api/v1/users/user?userId=${userId}`
    );

    console.log(userData);
    return userData.data;
  } catch (error) {
    console.log(error);
      return error.response.status
  }
};

const refreshTokens = async () => {
  try {
      const response = await axios.post("http://localhost:9000/api/v1/users/refreshTokens", {}, {
          withCredentials: true
      });

      console.log(response);
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

async function fetchLocationDetails(latitude, longitude, apiKey) {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&pretty=1`
    ); 

    const data = await response.json();

    if (data.results.length > 0) {
      const locationDetails = {
        formattedAddress: data.results[0].formatted,
        components: data.results[0].components,
        geometry: data.results[0].geometry,
      };
      return locationDetails;
    } else {
      return { error: "Address not found" };
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return { error: "Error fetching address" };
  }
}
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

export {fetchLocationDetails,fetchUserDetails,refreshTokens,updateUserAvatar,updateUserProfile,updateUserPassword}