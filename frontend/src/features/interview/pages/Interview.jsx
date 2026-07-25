import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className="border border-[#2a3348] rounded-xl overflow-hidden bg-[#1c2230]/40 transition-all hover:border-[#35435e]">
            <div className="flex items-start gap-4 p-4 cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
                <span className="text-[10px] font-bold text-[#ff2d78] bg-[#ff2d78]/10 border border-[#ff2d78]/25 px-2 py-0.5 rounded mt-0.5 shrink-0">
                    Q{index + 1}
                </span>
                <p className="flex-1 text-sm font-medium text-white leading-relaxed">{item.question}</p>
                <span className={`text-gray-500 transition-transform duration-200 shrink-0 mt-0.5 ${open ? 'rotate-180 text-[#ff2d78]' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className="border-t border-[#2a3348] bg-[#141922]/50 p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/25 px-2.5 py-0.5 rounded w-max uppercase tracking-wider">
                            Intention
                        </span>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed pl-1">{item.intention}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded w-max uppercase tracking-wider">
                            Model Answer
                        </span>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed pl-1">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className="relative pl-10 pb-8 flex flex-col gap-3 group">
        {/* Day Timeline node */}
        <div className="absolute left-[13px] top-[4px] w-3.5 h-3.5 rounded-full bg-[#0a0f1d] border-2 border-[#ff2d78] z-10 transition-all group-hover:scale-125 group-hover:bg-[#ff2d78]"></div>
        
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#ff2d78] bg-[#ff2d78]/10 border border-[#ff2d78]/25 px-2.5 py-0.5 rounded-full">
                Day {day.day}
            </span>
            <h3 className="text-md font-bold text-white leading-tight">{day.focus}</h3>
        </div>
        <ul className="flex flex-col gap-2 pl-2">
            {day.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-400 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 shrink-0" />
                    <span>{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    if (loading || !report) {
        return (
            <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0f1d] px-4 gap-4">
                <div className="w-16 h-16 border-4 border-t-[#ff2d78] border-r-transparent border-b-[#ff2d78] border-l-transparent rounded-full animate-spin"></div>
                <h1 className="text-xl font-semibold text-gray-300 animate-pulse">Loading your custom interview plan...</h1>
            </main>
        )
    }

    const matchScoreColor =
        report.matchScore >= 80 ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' :
        report.matchScore >= 60 ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 
        'border-rose-500 text-rose-400 bg-rose-500/5'

    return (
        <div className="min-h-screen w-full bg-[#0a0f1d] flex flex-col items-stretch p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background Auras */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-[#ff2d78]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto bg-[#161b22]/70 backdrop-blur-xl border border-[#2a3348] rounded-2xl shadow-2xl overflow-hidden z-10">

                {/* ── Left Sidebar Nav ── */}
                <nav className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-[#2a3348] p-6 flex flex-col justify-between gap-8 shrink-0">
                    <div className="flex flex-col gap-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 pl-3">Plan Sections</p>
                        <div className="flex flex-col gap-2">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    className={`flex items-center gap-3 w-full py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                                        activeNav === item.id 
                                        ? 'bg-[#ff2d78]/10 text-[#ff2d78] border border-[#ff2d78]/25' 
                                        : 'text-gray-400 hover:bg-[#1e2535] hover:text-white border border-transparent'
                                    }`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className="shrink-0">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        className="flex items-center justify-center gap-2.5 w-full bg-gradient-to-r from-[#ff2d78] to-[#d20d3b] hover:from-[#ff4c92] hover:to-[#e1034d] text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-pink-500/10 cursor-pointer duration-300 transform active:scale-95"
                    >
                        <svg height="16" width="16" className="shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </nav>

                {/* ── Center Content Area ── */}
                <main className="flex-1 p-6 md:p-8 min-h-[500px] max-h-[85vh] overflow-y-auto">
                    {activeNav === 'technical' && (
                        <section className="flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b border-[#2a3348] pb-4">
                                <h2 className="text-xl font-bold text-white">Technical Questions</h2>
                                <span className="text-xs bg-[#1e2535] border border-[#2a3348] text-gray-400 px-3 py-1 rounded-full">
                                    {report.technicalQuestions.length} questions
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className="flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b border-[#2a3348] pb-4">
                                <h2 className="text-xl font-bold text-white">Behavioral Questions</h2>
                                <span className="text-xs bg-[#1e2535] border border-[#2a3348] text-gray-400 px-3 py-1 rounded-full">
                                    {report.behavioralQuestions.length} questions
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className="flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b border-[#2a3348] pb-4 mb-2">
                                <h2 className="text-xl font-bold text-white">Preparation Road Map</h2>
                                <span className="text-xs bg-[#1e2535] border border-[#2a3348] text-gray-400 px-3 py-1 rounded-full">
                                    {report.preparationPlan.length}-day plan
                                </span>
                            </div>
                            {/* Vertical Line Container */}
                            <div className="relative border-l border-[#2a3348] ml-[7px] flex flex-col gap-1">
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* ── Right Sidebar ── */}
                <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[#2a3348] p-6 flex flex-col gap-8 shrink-0 bg-[#141922]/40">

                    {/* Match Score */}
                    <div className="flex flex-col items-center gap-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 self-start">Match Score</p>
                        <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all ${matchScoreColor}`}>
                            <span className="text-3xl font-extrabold tracking-tight leading-none">{report.matchScore}</span>
                            <span className="text-xs opacity-70 mt-1">%</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-400">
                            {report.matchScore >= 80 ? 'Strong fit for this role' :
                             report.matchScore >= 60 ? 'Moderate fit for this role' : 
                             'Requires significant review'}
                        </p>
                    </div>

                    <div className="h-[1px] bg-[#2a3348]" />

                    {/* Skill Gaps */}
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Skill Gaps</p>
                        <div className="flex flex-wrap gap-2">
                            {report.skillGaps && report.skillGaps.map((gap, i) => {
                                const severityTagColor = 
                                    gap.severity === 'high' ? 'text-rose-400 bg-rose-500/10 border-rose-500/25' :
                                    gap.severity === 'medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/25' :
                                    'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                                return (
                                    <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-lg border ${severityTagColor}`}>
                                        {gap.skill}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview