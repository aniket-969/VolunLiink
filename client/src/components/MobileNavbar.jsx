import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/AuthProvider';

const MobileNavbar = (prop) => {

  const navigate = useNavigate()

  const { user,isAuthenticated, setAccessToken,setUser } = useUserContext()

  const signOut = async () => {

    const axiosConfig = {
      withCredentials: true,
    };

    try {
      const response = await axios.post("http://localhost:9000/api/v1/users/logout", {}, axiosConfig
      )

      console.log(response)
      toast.success(response.data.message)
      setUser(null)
      setAccessToken(null)
      navigate("/")
    }

    catch (error) {
      if (error.response.status === 401) {
        
        toast.error("Unauthorized")
       
      }

      console.log(error);
    }
  }

  return (
    <>
      {prop.show ? (
        <></>
      ) : (
        <nav className=" flex flex-col justify-center items-center gap-3 w-full ">
          <Link to="/">Home</Link>

          <Link to={`/profile/${user?._id}`} >
            Profile
          </Link>

          <Link to={"/create-post"}>CreatePost</Link>
          {
            isAuthenticated ? <button className=" bg-dark text-white font-semibold py-2 px-6  rounded-[3rem] text-sm" onClick={signOut}>SignOut</button> :
              <Link to='/sign-up'><button className=" bg-dark text-white font-semibold py-2 px-6  rounded-[3rem] text-sm" >SignUp</button>
              </Link>
          }

        </nav>
      )}
    </>
  )
}

export default MobileNavbar