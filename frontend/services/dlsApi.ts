import { CalculationPayload, CalculationResponse, ResourceTableResponse, MatchFormat, ScenarioType } from '../types';

const BASE_URL = (import.meta as any).env?.VITE_API_URL;

export const calculateDLS = async (payload: CalculationPayload): Promise<CalculationResponse> => {
	try {
		const response = await fetch(`${BASE_URL}/calculate-dls-score/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Calculation failed');
		}

		const data = await response.json();
		return {
			success: true,
			data,
		};

	} catch (error) {
		console.error('DLS Calculation Error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown network error',
		};
	}
};

export const fetchResourceTable = async (format: MatchFormat): Promise<ResourceTableResponse> => {
	return {
		columns: ["Overs Left", "0 Wkts", "1 Wkt", "2 Wkts", "3 Wkts", "4 Wkts"],
		data: [
			[50, 100.0, 93.4, 85.1, 74.9, 62.7],
			[40, 90.3, 85.2, 79.8, 71.3, 60.5],
			[30, 75.1, 71.9, 68.3, 62.4, 54.1],
			[20, 54.2, 52.8, 50.9, 47.6, 42.9],
			[10, 31.4, 30.8, 29.9, 28.5, 26.1],
		]
	};
};
