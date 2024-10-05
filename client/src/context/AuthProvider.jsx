import { useContext, createContext, useEffect, useState } from "react";
import { refreshTokens } from "../utils/fetchUserDetails";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: {},
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  updateUser: () => {},
};

const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [location, setLocation] = useState("");

  const isAuthenticated = accessToken !== null;
  console.log(isAuthenticated);
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  const refreshAccessToken = async () => {
    const response = await refreshTokens();
    // console.log(response)
    const newAccessToken = response.accessToken;
    if (newAccessToken) {
      setAccessToken(newAccessToken);
  } else {
      signOut(); 
  }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  console.log(accessToken);
  useEffect(() => {
    if (accessToken) {
      const { exp } = jwtDecode(accessToken);
      const tokenExpiration = exp * 1000;
      const refreshTime = tokenExpiration - Date.now() - 300000;
      console.log(jwtDecode(accessToken));
      console.log(tokenExpiration, refreshTime);
      const timer = setTimeout(() => {
        refreshAccessToken();
      }, refreshTime);

      return () => clearTimeout(timer);
    }
    else{
      // console.log('here')
      refreshAccessToken()
    }
  }, [accessToken]);

  const signOut = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    accessToken,
    setAccessToken,
    setUser,
    isAuthenticated,
    location,
    setLocation,
    updateUser,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUserContext = () => useContext(AuthContext);
