import React from 'react'
import { useContext, createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const initialState = {
    user: {},
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },

}

const AuthContext = createContext(initialState)

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null;
    })
    const [isAuthenticated, setIsAuthenticated] = useState(()=>{
        return user?true:false
    })
    
    console.log(isAuthenticated)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
            console.log("setting user local")
        }
        else {
            localStorage.removeItem('user')
            console.log("removing user local")
        }
    }, [user])

    const value = {
        user, setUser, isAuthenticated, setIsAuthenticated
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useUserContext = () => useContext(AuthContext);