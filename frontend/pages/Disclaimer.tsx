import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, FileWarning, Info, ExternalLink } from 'lucide-react';
import { AppIcon } from '../components/ui/AppIcon';
import SEO from '../components/seo/SEO';

const Disclaimer: React.FC = () => {
    // SEO Content for this page
    const pageSEO = {
        title: 'Disclaimer | DLS Calculator',
        description: 'Important legal disclaimer and terms of use for the Duckworth-Lewis-Stern (DLS) Calculator. This tool is for informational purposes only.',
        canonical: 'https://dls.nishanthm.com/disclaimer',
    };

    const sections = [
        {
            title: "Unofficial Tool",
            icon: ShieldAlert,
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            content: "This application is an independent project developed for educational and recreational purposes. It is NOT affiliated with, endorsed by, or associated with the International Cricket Council (ICC) or any official cricket governing body."
        },
        {
            title: "Accuracy & G50",
            icon: AlertTriangle,
            color: "text-rose-500",
            bg: "bg-rose-50 dark:bg-rose-900/20",
            content: "Calculations provided here are estimates and may vary from official ICC results due to the 'G50' parameter. The G50 score is the average score expected in a 50-over innings and varies significantly based on playing conditions and the era of cricket. While we use standard professional values, official match referees use dynamic G50 figures tailored to specific match contexts."
        },
        {
            title: "No Liability",
            icon: FileWarning,
            color: "text-slate-500",
            bg: "bg-slate-50 dark:bg-slate-900/20",
            content: "The developers and maintainers of this application accept no liability for any errors, omissions, or consequences arising from the use of this calculator. Use this tool at your own risk."
        },
        {
            title: "Educational Use",
            icon: Info,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            content: "This tool is intended to help fans, players, and analysts understand the mechanics of the Duckworth-Lewis-Stern method. It serves as a simulation and learning aid."
        }
    ];

    return (
        <main className="space-y-8 pb-12">
            <SEO {...pageSEO} />

            {/* Hero Section with Smooth Fade-In */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                    <AppIcon size={400} />
                </div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex mb-6"
                    >
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-5 rounded-2xl">
                            <AlertTriangle className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                        </div>
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        Disclaimer
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-4 font-medium leading-relaxed">
                        Please read this important information regarding the use and limitations of this application.
                    </p>
                </div>
            </motion.div>

            {/* Info Grid with Staggered Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (idx * 0.1) }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-full hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors group"
                    >
                        <div className="flex items-center space-x-3 mb-4">
                            <div className={`p-2 rounded-xl ${section.bg} group-hover:scale-110 transition-transform duration-300`}>
                                <section.icon className={`w-5 h-5 ${section.color}`} />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white">{section.title}</h3>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {section.content}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Footer Link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
            >
                <a
                    href="https://en.wikipedia.org/wiki/Duckworth%E2%80%93Lewis%E2%80%93Stern_method"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                    <Info className="w-3 h-3" />
                    <span>Learn more about the mathematical model</span>
                    <ExternalLink className="w-3 h-3" />
                </a>
            </motion.div>
        </main>
    );
};

export default Disclaimer;
