import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import Header from "../../../components/Header";

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return (
            <main className="min-h-screen w-full flex items-center justify-center bg-[#0a0f1d]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-t-[#ff2d78] border-r-transparent border-b-[#ff2d78] border-l-transparent rounded-full animate-spin"></div>
                    <h1 className="text-xl font-medium text-gray-300">Loading...</h1>
                </div>
            </main>
        )
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return (
        <div className="min-h-screen flex flex-col bg-[#0b0f19]">
            <Header />
            <div className="flex-1 w-full flex flex-col">
                {children}
            </div>
        </div>
    )
}

export default Protected