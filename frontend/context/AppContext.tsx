import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MatchFormat, Theme } from '../types';
import { StatusBar, Style } from '@capacitor/status-bar';

export type ApiStatus = 'online' | 'offline' | 'checking' | 'error';

interface AppContextType {
	theme: Theme;
	toggleTheme: () => void;
	matchFormat: MatchFormat;
	setMatchFormat: (format: MatchFormat) => void;
	isCalculating: boolean;
	setIsCalculating: (val: boolean) => void;
	apiStatus: ApiStatus;
	setApiStatus: (status: ApiStatus) => void;
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
	const [apiStatus, setApiStatus] = useState<ApiStatus>('online'); // Default to online for better UX flow

	useEffect(() => {
		localStorage.setItem('dls_theme', theme);
		const root = window.document.documentElement;
		if (theme === Theme.DARK) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}

		// Update Status Bar to match theme
		const updateStatusBar = async () => {
			try {
				if (theme === Theme.DARK) {
					await StatusBar.setBackgroundColor({ color: '#0f172a' }); // slate-950
					await StatusBar.setStyle({ style: Style.Dark });
				} else {
					await StatusBar.setBackgroundColor({ color: '#f5f5f0' }); // beige/gray
					await StatusBar.setStyle({ style: Style.Light });
				}
			} catch (e) {
				console.warn('StatusBar plugin not available', e);
			}
		};
		updateStatusBar();
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
		<AppContext.Provider value={{
			theme,
			toggleTheme,
			matchFormat,
			setMatchFormat,
			isCalculating,
			setIsCalculating,
			apiStatus,
			setApiStatus
		}}>
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
