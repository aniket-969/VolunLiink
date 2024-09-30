import React from 'react'
import { useContext, createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Location from './../components/Location';

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
    const[location,setLocation] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return user ? true : false
    })

    console.log(isAuthenticated)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))

        }
        else {
            localStorage.removeItem('user')
        }
    }, [user])

    const value = {
        user, setUser, isAuthenticated, setIsAuthenticated,location,setLocation
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useUserContext = () => useContext(AuthContext);