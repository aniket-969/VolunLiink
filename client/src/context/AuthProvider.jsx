import axios from "axios";
import React from "react";
import { useContext, createContext, useEffect, useState } from "react";
import { refreshTokens } from "../utils/fetchUserDetails";

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
    const newAccessToken = response.accessTokens;
    setAccessToken(newAccessToken);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
  console.log(accessToken);
  // useEffect(()=>{
  //   if (accessToken) {
  //     const tokenExpiration = /* Calculate token expiration time based on the access token */;
  //     const refreshTime = tokenExpiration - 300000; // Refresh 5 minutes before expiration

  //     const timer = setTimeout(() => {
  //         refreshAccessToken();
  //     }, refreshTime);

  //     return () => clearTimeout(timer);
  // }
  // },[accessToken])

  const value = {
    user,
    accessToken,
    setAccessToken,
    setUser,
    isAuthenticated,
    location,
    setLocation,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUserContext = () => useContext(AuthContext);
