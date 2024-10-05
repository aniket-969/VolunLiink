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

const refreshTokens = async()=>{
    try {
      const response = await axios.post("http://localhost:9000/api/v1/users/refreshTokens",{
        withCredentials:true
      })
      if(response.data.success){
        return response.data.data
      }
      return;
    } catch (error) {
      console.error(error.response.data)
      throw error.response
    }
}


export { fetchUserDetails,refreshTokens};
