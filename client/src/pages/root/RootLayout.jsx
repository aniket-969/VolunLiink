import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Navbar from '../../components/Navbar'
import { useUserContext } from '../../context/AuthProvider'

const RootLayout = () => {
  const [cookies, setCookies, removeCookie] = useCookies("accessToken")
  const { user } = useUserContext()
  return (
    <>
      {user ? <>
        <Navbar />
        <Outlet />
      </> : <Navigate to="/sign-up" />}

    </>
  )
}

export default RootLayout