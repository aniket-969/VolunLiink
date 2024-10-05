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
      // If the status code is not successful, handle it accordingly
      if (response.data.statusCode === 401) {
          throw new Error("Unauthorized"); // You can customize the error message
      }
      
      return null; // Return null if there's another issue
  } catch (error) {
      console.error(error.response?.data);
      throw error.response;
  }
};


 
export { fetchUserDetails,refreshTokens};
