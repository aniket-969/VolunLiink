import React from 'react'
import { useContext, createContext, useEffect, useState } from 'react'

const initialState = {
    user: {},
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    updateUser: () => { }
    
}

const AuthContext = createContext(initialState)

export const AuthProvider = ({ children }) => {
    const[accessToken,setAccessToken] = useState(null)

    console.log(cookies)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null;
    })
    const [location, setLocation] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return user ? true : false
    })

    console.log(isAuthenticated)
    const updateUser = (updatedUserData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...updatedUserData
        }))
    }

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))

        }
        else {
            localStorage.removeItem('user')
        }

        

    }, [user])

    const value = {
        user, setUser, isAuthenticated, setIsAuthenticated, location, setLocation, updateUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useUserContext = () => useContext(AuthContext); 