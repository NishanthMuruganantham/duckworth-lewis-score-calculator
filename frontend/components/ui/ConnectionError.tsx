import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCcw } from 'lucide-react';

interface ConnectionErrorProps {
    onRetry: () => void;
    message?: string;
}

export const ConnectionError: React.FC<ConnectionErrorProps> = ({ onRetry, message }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[450px] p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">

            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 2.2, opacity: [0, 0.3, 0] }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "easeOut"
                        }}
                        className="absolute w-12 h-12 border-2 border-emerald-500 rounded-full pointer-events-none"
                    />
                ))}

                <div className="relative z-10 w-14 h-14 bg-red-600 rounded-full shadow-2xl border-4 border-red-700 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 rounded-full" />
                    <div className="w-full h-1 bg-white/20 absolute top-1/2 -translate-y-1/2" />
                    <WifiOff className="w-6 h-6 text-white/90 relative z-20" />
                </div>
            </div>

            <div className="space-y-3 mb-10 px-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Network Error
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                    {message || "We can't reach the DLS engine. Please check your data connection or Wi-Fi and try again."}
                </p>
            </div>

            <button
                onClick={onRetry}
                className="flex items-center justify-center space-x-3 w-full max-w-[220px] bg-slate-900 dark:bg-emerald-600 hover:bg-black dark:hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all active:scale-95 group"
            >
                <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Retry Connection</span>
            </button>

            <div className="mt-12 flex items-center space-x-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Offline Mode Engaged
                </span>
            </div>
        </div>
    );
};
