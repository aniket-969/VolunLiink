import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import MobileNavbar from './MobileNavbar';
import { IoReorderThree } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { FaConnectdevelop } from "react-icons/fa6";

const Navbar = () => {

    const navigate = useNavigate()
    
    const { isAuthenticated, setIsAuthenticated,user,setUser } = useUserContext() 

    const [show, setShow] = useState(true)

    const signOut = async () => {

        const axiosConfig = {
            withCredentials: true,
        };

        try {
            const response = await axios.post("http://localhost:9000/api/v1/users/logout", {}, axiosConfig
            )

            toast.success(response.message)
            setIsAuthenticated(false)
            setUser(null)
            navigate("/sign-up")

        }

        catch (error) {
            toast.error("error signing out user")
            console.log(error);
        }
    }

    return (
        <div className='flex items-center justify-between gap-2 bg-[#F0F8FF] mx-1 my-0.5 shadow-md px-8 py-2 md:py-4 lg:px-14 '>

            <Link to={`/`} className='flex gap-2 items-center'>
                <FaConnectdevelop className='text-2xl text-blue-800  ' />
                <h1 className=' font-bold text-2xl text-blue-800  '>VolunLink</h1>

            </Link>


            <Link to={`/profile/${user ? user._id : '123'}`} className='hidden sm:flex items-center gap-4'>
                <div className=' '>
                    <img src={user ? user.avatar : "https://res.cloudinary.com/dgyduqoht/image/upload/v1708522002/guestf_zqgvly.png"} alt="" className='image--cover  w-[60px] h-[60px] ' />
                </div>

                <h3 className='font-medium'>{user ? user.fullName : "Guest"}</h3>
            </Link>

            <nav className="hidden md:flex md:items-center md:justify-between  md:gap-4 font-medium lg:gap-6 ">

                <Link to='/' className='relative w-fit block after:block after:absolute after:h-[2px] after:bg-blue-500 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left '>Home</Link>
                <Link className='relative w-fit block after:block after:absolute after:h-[2px] after:bg-blue-500 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left ' to='/create-post' >Create</Link>
                <Link className='relative w-fit block after:block after:absolute after:h-[2px] after:bg-blue-500 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left ' to={`/profile/${user ? user._id : '123'}`}>Profile</Link>


            </nav>

            {show ?
                <div className=" md:hidden">
                    <IoReorderThree className="text-3xl " onClick={() => setShow(false)} />
                </div> :

                <div className="shadow-xl bg-black text-white flex flex-col justify-center items-center opacity-80 h-[50%] w-[100%] p-1 absolute top-0 left-0 gap-4 md:hidden z-[100]"><ImCross onClick={() => setShow(true)} className="text-xl " />  <MobileNavbar show={show} />
                </div>

            }
            {isAuthenticated ? <button className='hidden md:block bg-dark text-white py-2 px-4 rounded-[1.5rem]' onClick={signOut}>Sign Out</button> :
                <Link to='/sign-up'><button className='hidden md:block bg-dark text-white py-2 px-4 rounded-[1.5rem]' >Sign Up</button>
                </Link>
            }


        </div>
    )
}

export default Navbar