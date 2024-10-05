
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useUserContext } from '../../context/AuthProvider'

const RootLayout = () => {
  const { isAuthenticated } = useUserContext()
  return (
    <>
      {isAuthenticated ? <>
        <Navbar />
        <Outlet />
      </> : <Navigate to="/sign-up" />}

    </>
  )
}

export default RootLayout