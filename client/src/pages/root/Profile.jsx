import React, { useEffect, useState } from 'react'
import { fetchUserData, handlePostDelete } from '../../utils/fetchVolunteerData';
import toast from 'react-hot-toast';
import { useUserContext } from '../../context/AuthProvider';
import Card from '../../components/UI/Card';

const Profile = () => {

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
 
  const {user} = useUserContext() 
  
  const handleDelete = async (postId) => {

    try {
      const data = await handlePostDelete(postId)
      console.log(data.message);
      toast.success(data.message)
      fetchData()
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const fetchData = async () => {
    try {
     

      if (volData) setLoading(false)

    } catch (error) {
      console.error("Error fetching data:", error);

    }
  };

  useEffect(() => {

    fetchData();

  }, [])

  console.log(data);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        !message ? (

          <section className='my-5'>

            <div className='flex flex-col items-center gap-3 my-6 justify-center'>

              <img src={userData.avatar} className=' image--cover h-[100px] w-[100px] bg-black' />

              <div className='flex justify-center items-center flex-col'>
                <p>{userData.fullName}</p>
                <p>@{userData.username}</p>

              </div>

            </div>

            <div>
              {
                data.map(post => (
                  <Card post={post} handleDelete={handleDelete} />
                ))
              }
            </div>

          </section>

        ) : (
          <p>You have no posts to show</p>
        )
      )}</>
  )
}

export default Profile