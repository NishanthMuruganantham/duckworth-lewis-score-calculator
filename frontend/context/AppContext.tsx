import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MatchFormat, Theme } from '../types';

interface AppContextType {
	theme: Theme;
	toggleTheme: () => void;
	matchFormat: MatchFormat;
	setMatchFormat: (format: MatchFormat) => void;
	isCalculating: boolean;
	setIsCalculating: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		const saved = localStorage.getItem('dls_theme');
		return (saved as Theme) || Theme.LIGHT;
	});

	const [matchFormat, setMatchFormatState] = useState<MatchFormat>(() => {
		const saved = localStorage.getItem('dls_format');
		return (saved as MatchFormat) || MatchFormat.ODI;
	});

	const [isCalculating, setIsCalculating] = useState(false);

	useEffect(() => {
		localStorage.setItem('dls_theme', theme);
		const root = window.document.documentElement;
		if (theme === Theme.DARK) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}, [theme]);

	useEffect(() => {
		localStorage.setItem('dls_format', matchFormat);
	}, [matchFormat]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
	};

	const setMatchFormat = (format: MatchFormat) => {
		setMatchFormatState(format);
	};

	return (
		<AppContext.Provider value={{ theme, toggleTheme, matchFormat, setMatchFormat, isCalculating, setIsCalculating }}>
			{children}
		</AppContext.Provider>
	);
};

export const useApp = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useApp must be used within an AppProvider');
	}
	return context;
};
