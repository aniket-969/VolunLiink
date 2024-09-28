import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { isTokenExpired, refresh } from '../utils/fetchUserDetails';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TokenChecker = () => {
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies("accessToken")

    if (!cookies.accessToken) {
        console.log("No token found");
        
        return;
    }
    const decodedToken = jwtDecode(cookies.accessToken)
   
    const userId = localStorage.getItem("userId")
    

    const checkAuthentation = async () => {


        if (isTokenExpired(decodedToken.exp)) {
            console.log("expired");
            try {
                const accessToken = await refresh(userId)
                console.log(accessToken);
                removeCookie("accessToken")
                setCookie("accessToken", accessToken);

                console.log(cookies, cookies.accessToken);
            } catch (error) {
                console.log(error, "Error refreshing tokens");
            }
        }

        else {

            // console.log("Not expired");
        }

    }

    useEffect(() => {
       
         if(!cookies.accessToken){
            navigate("/sign-up")
         }
        checkAuthentation()
        const intervalId = setInterval(checkAuthentation, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [])

    return null;
}

export default TokenChecker