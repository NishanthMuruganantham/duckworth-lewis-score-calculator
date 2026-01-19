import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    IconInn1Interrupted,
    IconInn1Curtailed,
    IconInn2Delayed,
    IconInn2Interrupted,
    IconInn2Curtailed
} from '../components/ui/CricketIcons';
import SEO from '../components/seo/SEO';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const scenarios = [
        {
            id: 'inn1-interrupted',
            title: '1st Innings Interruption',
            description: 'Play stops during 1st innings but resumes later. Match overs are reduced.',
            icon: IconInn1Interrupted,
            path: '/interrupted-first-innings',
            color: 'bg-amber-500'
        },
        {
            id: 'inn1-curtailed',
            title: '1st Innings Curtailed',
            description: 'Play ends permanently in 1st innings. Calculate target for 2nd innings.',
            icon: IconInn1Curtailed,
            path: '/curtailed-first-innings',
            color: 'bg-rose-500'
        },
        {
            id: 'inn2-interrupted',
            title: '2nd Innings Interruption (DLS Par)',
            description: 'Play stops during the chase. Calculate Par Score or the Revised Target for resumption.',
            icon: IconInn2Interrupted,
            path: '/interrupted-second-innings',
            color: 'bg-emerald-500'
        },
        {
            id: 'inn2-delayed',
            title: '2nd Innings Delayed',
            description: 'Second innings start is delayed before a ball is bowled. Calculate revised target.',
            icon: IconInn2Delayed,
            path: '/delayed-second-innings',
            color: 'bg-blue-500'
        },
        {
            id: 'inn2-curtailed',
            title: '2nd Innings Curtailed',
            description: 'Chase ends permanently. Determine the winner via exact Par Score.',
            icon: IconInn2Curtailed,
            path: '/curtailed-second-innings',
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <SEO
                title="DLS Calculator Dashboard - Choose Your Scenario"
                description="The ultimate DLS tool. Choose between 1st innings interruptions, delayed starts, or abandoned chases to get precise par scores."
                canonical="https://dls.nishanthm.com/"
            />

            <div className="text-center space-y-3 pt-4 sm:pt-6">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Every <span className="text-emerald-600 dark:text-emerald-400">Rain-Affected</span> Scenario
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-xs xs:text-sm sm:text-base font-medium px-4">
                    Select your match situation for an accurate DLS calculation.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-1">
                {scenarios.map((scenario, index) => (
                    <motion.div
                        key={scenario.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(scenario.path)}
                        className="cursor-pointer group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300"
                    >
                        <div className="flex items-start space-x-4 sm:space-x-5 relative z-10">
                            <div className={`p-3 sm:p-4 rounded-xl ${scenario.color} bg-opacity-10 dark:bg-opacity-20 group-hover:bg-opacity-20 transition-all flex-shrink-0`}>
                                <scenario.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-slate-800 dark:text-white" />
                            </div>
                            <div className="flex-1 space-y-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                                    {scenario.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                                    {scenario.description}
                                </p>
                            </div>
                        </div>

                        {/* Subtle Gradient Background on Hover */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${scenario.color.replace('bg-', 'from-')} to-transparent transition-opacity duration-500`} />

                        {/* Bottom Accent Line */}
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-emerald-500 group-hover:w-full transition-all duration-500" />
                    </motion.div>
                ))}

                {/* About Card */}
                <div className="sm:col-span-2 flex items-center bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 text-slate-500 dark:text-slate-400 select-none">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-slate-200 dark:bg-slate-700/50 rounded-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 text-sm sm:text-base">?</div>
                        <div className="flex-1">
                            <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200">Need Help?</p>
                            <p className="text-xs sm:text-sm mt-0.5">The DLS method uses resource percentages to equalize matches. Check our <span className="text-emerald-600 font-semibold cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); navigate('/how-it-works'); }}>Documentation</span> to learn more.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
