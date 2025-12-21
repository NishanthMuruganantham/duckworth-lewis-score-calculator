import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import { checkApiHealth } from './services/dlsApi';
import { ConnectionError } from './components/ui/ConnectionError.tsx';
import StadiumLoader from './components/ui/StadiumLoader';

// Lazy load pages for better performance (FCP)
const InterruptedSecondInnings = lazy(() => import('./pages/InterruptedSecondInnings'));
const CurtailedFirstInnings = lazy(() => import('./pages/CurtailedFirstInnings'));
const DelayedSecondInnings = lazy(() => import('./pages/DelayedSecondInnings'));
const CurtailedSecondInnings = lazy(() => import('./pages/CurtailedSecondInnings'));
const InterruptedFirstInnings = lazy(() => import('./pages/InterruptedFirstInnings'));
const ResourceTable = lazy(() => import('./pages/ResourceTable'));
const Documentation = lazy(() => import('./pages/Documentation'));

const AppContent: React.FC = () => {
	const { apiStatus, setApiStatus } = useApp();

	const performBootCheck = async () => {
		setApiStatus('checking');
		const isHealthy = await checkApiHealth();
		setApiStatus(isHealthy ? 'online' : 'offline');
	};

	useEffect(() => {
		performBootCheck();
	}, []);

	if (apiStatus === 'checking') {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
				<StadiumLoader loading={true} message="Booting Systems" />
			</div>
		);
	}

	if (apiStatus === 'offline') {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
				<div className="w-full max-w-md">
					<ConnectionError onRetry={performBootCheck} />
				</div>
			</div>
		);
	}

	return (
		<BrowserRouter>
			<Suspense fallback={
				<div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
					<StadiumLoader loading={true} message="Loading Page" />
				</div>
			}>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Navigate to="/interrupted-second-innings" replace />} />

						{/* SEO Friendly Named Routes */}
						<Route path="delayed-second-innings" element={<DelayedSecondInnings />} />
						<Route path="curtailed-second-innings" element={<CurtailedSecondInnings />} />
						<Route path="interrupted-second-innings" element={<InterruptedSecondInnings />} />
						<Route path="curtailed-first-innings" element={<CurtailedFirstInnings />} />
						<Route path="interrupted-first-innings" element={<InterruptedFirstInnings />} />

						<Route path="resource-table" element={<ResourceTable />} />
						<Route path="how-it-works" element={<Documentation />} />

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
			</Suspense>
		</BrowserRouter>
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
