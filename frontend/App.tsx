import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import InterruptedSecondInnings from './pages/InterruptedSecondInnings';
import CurtailedFirstInnings from './pages/CurtailedFirstInnings';
import DelayedSecondInnings from './pages/DelayedSecondInnings';
import CurtailedSecondInnings from './pages/CurtailedSecondInnings';
import InterruptedFirstInnings from './pages/InterruptedFirstInnings';
import ResourceTable from './pages/ResourceTable';
import Documentation from './pages/Documentation';
import { checkApiHealth } from './services/dlsApi';
import { ConnectionError } from './components/ui/ConnectionError.tsx';
import StadiumLoader from './components/ui/StadiumLoader';

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
		<HashRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Navigate to="/interrupted-inn2" replace />} />

					<Route path="delayed-inn2" element={<DelayedSecondInnings />} />
					<Route path="curtailed-inn2" element={<CurtailedSecondInnings />} />
					<Route path="interrupted-inn2" element={<InterruptedSecondInnings />} />
					<Route path="curtailed-inn1" element={<CurtailedFirstInnings />} />
					<Route path="interrupted-inn1" element={<InterruptedFirstInnings />} />

					<Route path="resources" element={<ResourceTable />} />
					<Route path="docs" element={<Documentation />} />
				</Route>
			</Routes>
		</HashRouter>
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
