import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Navbar from '../../components/Navbar'

const RootLayout = () => {
  const [cookies, setCookies, removeCookie] = useCookies("accessToken")

  return (
    <>
      {cookies.accessToken ? <>
        <Navbar />
        <Outlet />
      </> : <Navigate to="/sign-up" />}

    </>
  )
}

export default RootLayout