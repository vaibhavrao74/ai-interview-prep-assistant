import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'

const Header = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-[#161b22]/80 backdrop-blur-md border-b border-[#2a3348] px-6 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                {/* Logo / Home link */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="p-2 bg-[#ff2d78]/15 rounded-xl border border-[#ff2d78]/25 group-hover:border-[#ff2d78]/50 transition-all duration-300">
                        <svg className="text-[#ff2d78]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </span>
                    <span className="text-xl font-black text-white tracking-tight">
                        Interview<span className="text-[#ff2d78]">AI</span>
                    </span>
                </Link>

                {/* User info and navigation */}
                {user && (
                    <div className="flex items-center gap-5">
                        
                        {/* Nav Link */}
                        <Link to="/" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        
                        {/* Vertical line divider */}
                        <div className="w-[1px] h-4 bg-[#2a3348]"></div>
                        
                        {/* Profile Info */}
                        <div className="flex items-center gap-3">
                            {/* Avatar dot */}
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff2d78] to-[#d20d3b] flex items-center justify-center font-bold text-white text-sm shadow-md">
                                {user.username ? user.username[0].toUpperCase() : 'U'}
                            </div>
                            <span className="hidden sm:inline text-sm font-medium text-gray-300">
                                {user.username}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <button 
                            onClick={onLogout}
                            className="text-xs font-semibold text-gray-400 hover:text-white border border-[#2a3348] hover:border-[#ff2d78] px-3.5 py-2 rounded-xl transition-all cursor-pointer transform active:scale-95 duration-200"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
