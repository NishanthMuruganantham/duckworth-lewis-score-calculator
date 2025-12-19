import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trash2 } from 'lucide-react';

interface WicketErrorProps {
    onRetry: () => void;
    onBack?: () => void;
    message?: string;
}

export const WicketError: React.FC<WicketErrorProps> = ({ onRetry, onBack, message }) => {
    const btnBase = "flex items-center justify-center space-x-2 w-full h-12 px-6 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap text-sm shadow-sm";

    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[420px] p-6 text-center select-none bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">

            {/* 1. Illustration: Ball Hitting Stumps */}
            <div className="relative w-48 h-32 flex items-center justify-center mb-8">

                {/* Stumps */}
                <div className="flex space-x-4 items-end">
                    {/* Off Stump */}
                    <motion.div
                        className="w-1.5 h-16 bg-slate-200 dark:bg-slate-700 rounded-full"
                        animate={{ rotate: [0, -12], x: [0, -4] }}
                        transition={{ delay: 0.3, duration: 0.2, ease: "easeOut" }}
                    />
                    {/* Middle Stump */}
                    <motion.div
                        className="w-1.5 h-16 bg-slate-300 dark:bg-slate-600 rounded-full relative"
                        animate={{ rotate: [0, 8], x: [0, 4] }}
                        transition={{ delay: 0.3, duration: 0.2, ease: "easeOut" }}
                    >
                        {/* Bails */}
                        <motion.div
                            className="absolute -top-1 -left-2 w-5 h-1 bg-slate-400 dark:bg-slate-500 rounded-full"
                            animate={{ y: [0, -15], x: [0, 5], opacity: [1, 0] }}
                            transition={{ delay: 0.3, duration: 0.25 }}
                        />
                    </motion.div>
                    {/* Leg Stump */}
                    <div className="w-1.5 h-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>

                {/* The Ball */}
                <motion.div
                    initial={{ x: -100, y: -30, opacity: 0 }}
                    animate={{ x: -8, y: 15, opacity: 1 }}
                    transition={{ duration: 0.45, ease: "easeIn" }}
                    className="absolute w-4.5 h-4.5 bg-red-600 rounded-full shadow-lg z-10 border border-red-700"
                >
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20" />
                </motion.div>
            </div>

            {/* 2. Text Content */}
            <div className="space-y-2 mb-8 px-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Server Error Occurred
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[260px] mx-auto leading-relaxed">
                    {message || "We encountered an issue processing the DLS request."}
                </p>
            </div>

            {/* 3. Action Buttons - Stacked layout ensures no text wrapping and clean hierarchy */}
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
                <button
                    onClick={onRetry}
                    className={`${btnBase} bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20`}
                >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry Calculation</span>
                </button>

                {onBack && (
                    <button
                        onClick={onBack}
                        className={`${btnBase} bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300`}
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear Form</span>
                    </button>
                )}
            </div>

            {/* Subtle Bottom Brand Tag */}
            <div className="mt-10 pt-4 border-t border-slate-50 dark:border-slate-800 w-full">
                <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                    DLS System Integrity v1.2
                </span>
            </div>
        </div>
    );
};
