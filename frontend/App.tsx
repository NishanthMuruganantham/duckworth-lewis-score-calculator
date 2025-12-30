import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import { checkApiHealth } from './services/dlsApi';
import { ConnectionError } from './components/ui/ConnectionError.tsx';
import { SplashScreen as SplashScreenComponent } from './components/ui/SplashScreen';
import { SplashScreen } from '@capacitor/splash-screen';
import { AnimatePresence, motion } from 'framer-motion';

// Standard imports for native feel and instant page transitions
import InterruptedSecondInnings from './pages/InterruptedSecondInnings';
import CurtailedFirstInnings from './pages/CurtailedFirstInnings';
import DelayedSecondInnings from './pages/DelayedSecondInnings';
import CurtailedSecondInnings from './pages/CurtailedSecondInnings';
import InterruptedFirstInnings from './pages/InterruptedFirstInnings';
import ResourceTable from './pages/ResourceTable';
import Documentation from './pages/Documentation';
import Disclaimer from './pages/Disclaimer';
import Dashboard from './pages/Dashboard';

const AppContent: React.FC = () => {
	const { apiStatus, setApiStatus } = useApp();
	const [showSplash, setShowSplash] = useState(true);

	const performBootCheck = async () => {
		setApiStatus('checking');
		const isHealthy = await checkApiHealth();

		// Ensure splash screen shows for at least 2 seconds for the animation to play
		setTimeout(() => {
			setApiStatus(isHealthy ? 'online' : 'offline');
			setShowSplash(false);
		}, 2000);

		// Hide native splash screen once the web app is ready
		try {
			await SplashScreen.hide();
		} catch (e) {
			console.warn('Capacitor SplashScreen plugin not available', e);
		}
	};

	useEffect(() => {
		performBootCheck();
	}, []);

	return (
		<AnimatePresence mode="wait">
			{showSplash ? (
				<SplashScreenComponent key="splash" />
			) : (
				<motion.div
					key="content"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, ease: "easeOut" }}
				>
					{apiStatus === 'online' ? (
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<Layout />}>
									<Route index element={<Dashboard />} />

									{/* SEO Friendly Named Routes */}
									<Route path="delayed-second-innings" element={<DelayedSecondInnings />} />
									<Route path="curtailed-second-innings" element={<CurtailedSecondInnings />} />
									<Route path="interrupted-second-innings" element={<InterruptedSecondInnings />} />
									<Route path="curtailed-first-innings" element={<CurtailedFirstInnings />} />
									<Route path="interrupted-first-innings" element={<InterruptedFirstInnings />} />

									<Route path="resource-table" element={<ResourceTable />} />
									<Route path="how-it-works" element={<Documentation />} />
									<Route path="disclaimer" element={<Disclaimer />} />

									{/* Redirect legacy short routes to new SEO-friendly routes */}
									<Route path="delayed-inn2" element={<Navigate to="/delayed-second-innings" replace />} />
									<Route path="curtailed-inn2" element={<Navigate to="/curtailed-second-innings" replace />} />
									<Route path="interrupted-inn2" element={<Navigate to="/interrupted-second-innings" replace />} />
									<Route path="curtailed-inn1" element={<Navigate to="/curtailed-first-innings" replace />} />
									<Route path="interrupted-inn1" element={<Navigate to="/interrupted-first-innings" replace />} />
									<Route path="resources" element={<Navigate to="/resource-table" replace />} />
									<Route path="docs" element={<Navigate to="/how-it-works" replace />} />
								</Route>
							</Routes>
						</BrowserRouter>
					) : (
						<div style={{
							display: 'flex',
							height: '100vh',
							width: '100vw',
							alignItems: 'center',
							justifyContent: 'center',
							background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
							padding: '1.5rem',
							boxSizing: 'border-box',
						}}>
							<div style={{
								width: '100%',
								maxWidth: '28rem',
							}}>
								<ConnectionError onRetry={performBootCheck} />
							</div>
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const App: React.FC = () => {
	return (
		<AppProvider>
			<AppContent />
		</AppProvider>
	);
};

export default App;
