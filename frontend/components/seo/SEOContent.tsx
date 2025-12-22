import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, HelpCircle, Info } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface SEOContentProps {
    title: string;
    description: string;
    faqs?: FAQItem[];
}

const SEOContent: React.FC<SEOContentProps> = ({ title, description, faqs }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="mt-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
            {/* Mobile Header (Collapsible) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left group focus:outline-none"
                aria-expanded={isOpen}
            >
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-50 dark:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Understanding DLS: {title}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 md:hidden">
                            {isOpen ? 'Tap to collapse' : 'Tap to read more about this calculation'}
                        </p>
                    </div>
                </div>
                <div className="md:hidden">
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                </div>
            </button>

            {/* Main Content Area */}
            <div className={`${isOpen ? 'block' : 'hidden md:block'} px-6 pb-8 md:px-8 border-t border-slate-100 dark:border-slate-800 pt-6 animate-in fade-in slide-in-from-top-2 duration-300`}>
                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <h3 className="text-md font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-2 mb-4">
                        <Info className="w-4 h-4" />
                        <span>The Duckworth–Lewis–Stern Method Explained</span>
                    </h3>
                    <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                        {description.split('\n').map((line, i) => (
                            <p key={i} className="mb-3">{line}</p>
                        ))}
                    </div>

                    {faqs && faqs.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-md font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-2 mb-4">
                                <HelpCircle className="w-4 h-4" />
                                <span>Frequently Asked Questions</span>
                            </h3>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm mb-2">{faq.question}</p>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </article>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400">
                        This DLS calculator uses professional-grade resource tables for high accuracy in cricket analytics.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SEOContent;
