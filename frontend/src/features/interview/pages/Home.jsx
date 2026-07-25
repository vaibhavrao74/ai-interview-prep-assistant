import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ isDragging, setIsDragging ] = useState(false)
    const [ error, setError ] = useState("")
    const [ profileTab, setProfileTab ] = useState("resume")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
            setError("")
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
                setSelectedFile(file)
                setError("")
            } else {
                setError("Only PDF files are supported.")
            }
        }
    }

    const removeSelectedFile = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleGenerateReport = async () => {
        setError("")
        if (!jobDescription) {
            setError("Job description is required.")
            return
        }
        if (profileTab === "resume" && !selectedFile) {
            setError("Please upload your resume PDF.")
            return
        }
        if (profileTab === "description" && !selfDescription.trim()) {
            setError("Please enter your quick self-description.")
            return
        }

        try {
            const data = await generateReport({ 
                jobDescription, 
                selfDescription: profileTab === "description" ? selfDescription : "", 
                resumeFile: profileTab === "resume" ? selectedFile : null 
            })
            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || "Failed to generate report"
            setError(errMsg)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0f1d] px-4 gap-4">
                <div className="w-16 h-16 border-4 border-t-[#ff2d78] border-r-transparent border-b-[#ff2d78] border-l-transparent rounded-full animate-spin"></div>
                <h1 className="text-xl font-semibold text-gray-300 animate-pulse">Loading your custom interview plan...</h1>
                <p className="text-sm text-gray-500">Analyzing job description and mapping skills (this may take ~30s)...</p>
            </main>
        )
    }

    return (
        <div className="flex-1 w-full bg-[#0a0f1d] p-4 md:p-6 lg:p-8 flex flex-col gap-6 relative overflow-hidden">
            {/* Glowing background details */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-[#ff2d78]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>

            {/* Content Container */}
            <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col lg:flex-row gap-8 z-10">
                
                {/* Left Side: Recent Plans Sidebar (on Desktop) */}
                {reports && reports.length > 0 && (
                    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4 order-2 lg:order-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[#ff2d78] p-1.5 bg-[#ff2d78]/10 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </span>
                            <h2 className="text-lg font-bold text-white">Recent Plans</h2>
                            <span className="text-xs bg-[#1e2535] px-2 py-0.5 rounded-full text-gray-400 font-semibold">{reports.length}</span>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[520px] pr-1 scrollbar-thin scrollbar-thumb-[#2a3348] scrollbar-track-transparent">
                            {reports.map(report => (
                                <div 
                                    key={report._id} 
                                    className="bg-[#161b22]/70 border border-[#2a3348] hover:border-[#ff2d78] rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5 group flex flex-col gap-2"
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-sm font-semibold text-gray-200 group-hover:text-[#ff2d78] transition-colors line-clamp-1 flex-1">
                                            {report.title || 'Untitled Position'}
                                        </h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${report.matchScore >= 80 ? 'bg-emerald-500/10 text-[#3fb950]' : report.matchScore >= 60 ? 'bg-amber-500/10 text-[#f5a623]' : 'bg-rose-500/10 text-[#ff4d4d]'}`}>
                                            {report.matchScore}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] text-gray-500">
                                        <span>Match Score</span>
                                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}

                {/* Right Side: Form (takes remaining space) */}
                <main className="flex-1 flex flex-col gap-6 order-1 lg:order-2">
                    {/* Header */}
                    <div className="text-left">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                            Create Your Custom <span className="bg-gradient-to-r from-[#ff2d78] to-[#ff6b9d] bg-clip-text text-transparent">Interview Plan</span>
                        </h1>
                        <p className="text-gray-400 text-sm">
                            AI analyzes the job description and your profile to build a winning prep strategy.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="w-full bg-[#161b22]/70 backdrop-blur-xl border border-[#2a3348] rounded-2xl shadow-2xl overflow-hidden transition-all hover:border-[#35435e] flex flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2a3348]">
                            
                            {/* Left Panel - Job Description */}
                            <div className="p-5 md:p-6 flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#ff2d78] p-1.5 bg-[#ff2d78]/10 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                    </span>
                                    <h2 className="text-sm font-bold text-white flex-1">Target Job Description</h2>
                                    <span className="text-[10px] font-bold tracking-wider uppercase bg-[#ff2d78]/10 text-[#ff2d78] px-2 py-0.5 rounded">Required</span>
                                </div>
                                <textarea
                                    onChange={(e) => { setJobDescription(e.target.value) }}
                                    value={jobDescription}
                                    className="w-full h-72 md:h-80 bg-[#1e2535]/50 border border-[#2a3348] focus:border-[#ff2d78] focus:ring-4 focus:ring-[#ff2d78]/15 rounded-xl p-4 text-white text-sm outline-none transition-all placeholder-gray-500 resize-none leading-relaxed"
                                    placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                                    maxLength={5000}
                                />
                                <div className="text-right text-[10px] text-gray-500">
                                    {jobDescription.length} / 5000 chars
                                </div>
                            </div>

                            {/* Right Panel - Profile Input (using Tabs) */}
                            <div className="p-5 md:p-6 flex flex-col gap-4 justify-between">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#ff2d78] p-1.5 bg-[#ff2d78]/10 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        </span>
                                        <h2 className="text-sm font-bold text-white">Your Profile Source</h2>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex bg-[#1e2535] p-1 rounded-xl border border-[#2a3348]">
                                        <button
                                            type="button"
                                            onClick={() => setProfileTab("resume")}
                                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                                profileTab === "resume" 
                                                    ? "bg-[#ff2d78] text-white shadow-md" 
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            Upload Resume
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileTab("description")}
                                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                                profileTab === "description" 
                                                    ? "bg-[#ff2d78] text-white shadow-md" 
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            Quick Self-Description
                                        </button>
                                    </div>

                                    {/* Tab content area */}
                                    <div className="min-h-[160px] flex flex-col justify-center">
                                        {profileTab === "resume" ? (
                                            selectedFile ? (
                                                <div className="flex flex-col items-center justify-center gap-2 border border-solid border-[#ff2d78]/50 bg-[#ff2d78]/5 rounded-xl p-6 relative">
                                                    <span className="text-[#ff2d78]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                    </span>
                                                    <p className="text-sm font-medium text-white truncate max-w-full px-2">{selectedFile.name}</p>
                                                    <p className="text-xs text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                    <button
                                                        type="button"
                                                        onClick={removeSelectedFile}
                                                        className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                                                    >
                                                        Remove File
                                                    </button>
                                                </div>
                                            ) : (
                                                <div 
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                    className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all min-h-[150px] ${
                                                        isDragging ? 'border-[#ff2d78] bg-[#ff2d78]/10' : 'border-[#2a3348] hover:border-[#ff2d78] hover:bg-[#ff2d78]/5'
                                                    }`}
                                                >
                                                    <label htmlFor="resume" className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full">
                                                        <span className="text-[#ff2d78]">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                                        </span>
                                                        <p className="text-sm font-medium text-gray-300">Click to upload or drag &amp; drop</p>
                                                        <p className="text-xs text-gray-500">PDF only (Max 5MB)</p>
                                                    </label>
                                                    <input 
                                                        ref={resumeInputRef} 
                                                        onChange={handleFileChange} 
                                                        hidden 
                                                        type="file" 
                                                        id="resume" 
                                                        name="resume" 
                                                        accept=".pdf" 
                                                    />
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <textarea
                                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                                    value={selfDescription}
                                                    id="selfDescription"
                                                    name="selfDescription"
                                                    className="w-full h-32 bg-[#1e2535]/50 border border-[#2a3348] focus:border-[#ff2d78] focus:ring-4 focus:ring-[#ff2d78]/15 rounded-xl p-3 text-white text-sm outline-none transition-all placeholder-gray-500 resize-none leading-relaxed"
                                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {/* Info Box */}
                                    <div className="flex items-start gap-2.5 p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl">
                                        <span className="text-blue-400 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        </span>
                                        <p className="text-xs text-blue-300 leading-relaxed">
                                            Provide either your <strong className="text-white">Resume PDF</strong> or a <strong className="text-white">Quick Description</strong> to personalize your strategy.
                                        </p>
                                    </div>

                                    {/* Error Banner */}
                                    {error && (
                                        <div className="flex items-start gap-2.5 p-3 bg-red-950/20 border border-red-900/40 rounded-xl">
                                            <span className="text-red-400 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                            </span>
                                            <p className="text-xs text-red-300 leading-relaxed">
                                                {error}
                                            </p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#141922] border-t border-[#2a3348]">
                            <span className="text-[11px] text-gray-500">AI-Powered Strategy Generation &bull; Approx 30s</span>
                            <button
                                onClick={handleGenerateReport}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff2d78] to-[#d20d3b] hover:from-[#ff4c92] hover:to-[#e1034d] text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-pink-500/20 cursor-pointer text-xs"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                                Generate My Interview Strategy
                            </button>
                        </div>
                    </div>
                </main>

            </div>

            {/* Page Footer */}
            <footer className="flex items-center justify-center gap-6 mt-4 z-10 text-xs text-gray-600">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
            </footer>
        </div>
    )
}

export default Home