import axios from "axios";

const getPosts = async (page =1,limit=5,filter={}) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
      ...filter 
    });
    const response = await axios.get(`http://localhost:9000/api/v1/volunteers/posts?${params.toString()}`)
    console.log(response.data);
    
    return response.data.data || [];
  } catch (error) {
    console.log(error, "Error fetching posts");
    throw error
  }
};

const getMapData = async(latitude,longitude)=>{
  try {
    const params = new URLSearchParams({latitude,longitude})
     const response = await axios.get(`http://localhost:9000/api/v1/volunteers/map-location?${params.toString()}`)
     console.log(response)
     if(response.data.success){
       return response.data.data || []
     }
      return []
  } catch (error) {
    console.error("Error fetching map data",error)
    throw error
  }
 
}

const fetchUserData = async (userId) => {
  try {
    console.log(userId);

    const userData = await axios.get(
      `http://localhost:9000/api/v1/users/volunteer/${userId}`
    );

    console.log(userData);
    return userData.data;
  } catch (error) {
    console.log(error, "There was an error fetching user data");
  }
};
  
const fetchPostDetails = async (postId) => {
  try {
    const postData = await axios.get(
      `http://localhost:9000/api/v1/users/volunteer/post/${postId}`
    );

    return postData.data;
  } catch (error) {
    console.log(error, "There was an error fetching post data");
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
      `http://localhost:9000/api/v1/users/volunteers/${postId}`
    );
    console.log(data);
    
    return data.data
  } catch (error) {
    console.log(error);
  }
};

export {
  getPosts,
  getMapData,
  fetchUserData,
  fetchPostDetails,
  formatDate,
  formatUpdatedAt,
  handlePostDelete
};
