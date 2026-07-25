import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({email,password})
        navigate('/')
    }

    if(loading){
        return (
            <main className="min-h-screen w-full flex items-center justify-center bg-[#0a0f1d]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-t-[#ff2d78] border-r-transparent border-b-[#ff2d78] border-l-transparent rounded-full animate-spin"></div>
                    <h1 className="text-xl font-medium text-gray-300">Signing you in...</h1>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[#0a0f1d] px-4 relative overflow-hidden">
            {/* Glowing Auras */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff2d78]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-[#161b22]/70 backdrop-blur-xl border border-[#2a3348] rounded-2xl p-8 shadow-2xl z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                        Welcome <span className="bg-gradient-to-r from-[#ff2d78] to-[#ff6b9d] bg-clip-text text-transparent">Back</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Log in to resume your AI interview preparation</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" 
                            id="email" 
                            name='email' 
                            placeholder='name@company.com'
                            required
                            className="bg-[#1e2535] border border-[#2a3348] focus:border-[#ff2d78] focus:ring-4 focus:ring-[#ff2d78]/15 rounded-xl py-3 px-4 outline-none text-white transition-all placeholder-gray-600 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" 
                            id="password" 
                            name='password' 
                            placeholder='••••••••'
                            required
                            className="bg-[#1e2535] border border-[#2a3348] focus:border-[#ff2d78] focus:ring-4 focus:ring-[#ff2d78]/15 rounded-xl py-3 px-4 outline-none text-white transition-all placeholder-gray-600 text-sm"
                        />
                    </div>
                    <button className="w-full bg-gradient-to-r from-[#ff2d78] to-[#d20d3b] hover:from-[#ff4c92] hover:to-[#e1034d] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-pink-500/20 cursor-pointer mt-2 text-sm">
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-400">
                    Don't have an account? <Link to={"/register"} className="text-[#ff2d78] hover:text-[#ff6b9d] font-medium transition-colors">Register</Link>
                </p>
            </div>
        </main>
    )
}

export default Login