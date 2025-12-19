import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import InterruptedSecondInnings from './pages/InterruptedSecondInnings';
import CurtailedFirstInnings from './pages/CurtailedFirstInnings';
import DelayedSecondInnings from './pages/DelayedSecondInnings';
import CurtailedSecondInnings from './pages/CurtailedSecondInnings';
import InterruptedFirstInnings from './pages/InterruptedFirstInnings';
import ResourceTable from './pages/ResourceTable';
import Documentation from './pages/Documentation';

const App: React.FC = () => {
	return (
		<AppProvider>
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
		</AppProvider>
	);
};

export default App;
