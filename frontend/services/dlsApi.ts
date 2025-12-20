import { CalculationPayload, CalculationResponse, ResourceTableResponse, MatchFormat, ScenarioType } from '../types';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

const NETWORK_CONFIG = {
	HEALTH_CHECK_TIMEOUT: 5000,
	API_CALL_TIMEOUT: 10000,
	HEALTH_CHECK_RETRIES: 3,
	RETRY_DELAY: 1000,
};

/**
 * Utility function to add timeout to fetch requests
 */
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number): Promise<Response> => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		return response;
	} finally {
		clearTimeout(timeoutId);
	}
};

export const checkApiHealth = async (): Promise<boolean> => {
	for (let attempt = 1; attempt <= NETWORK_CONFIG.HEALTH_CHECK_RETRIES; attempt++) {
		try {
			const response = await fetchWithTimeout(
				`${BASE_URL}/health-check/`,
				{ method: 'GET' },
				NETWORK_CONFIG.HEALTH_CHECK_TIMEOUT
			);
			if (response.ok) {
				return true;
			}
		} catch (error) {
			if (attempt < NETWORK_CONFIG.HEALTH_CHECK_RETRIES) {
				await new Promise(resolve => setTimeout(resolve, NETWORK_CONFIG.RETRY_DELAY));
				continue;
			}
		}
	}
	return false;
};

export const calculateDLS = async (payload: CalculationPayload): Promise<CalculationResponse> => {
	try {
		const response = await fetchWithTimeout(
			`${BASE_URL}/calculate-dls-score/`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			},
			NETWORK_CONFIG.API_CALL_TIMEOUT
		);

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
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				console.error('DLS Calculation Timeout');
				return {
					success: false,
					error: 'Request timed out. Please try again.',
				};
			}
			console.error('DLS Calculation Error:', error);
			return {
				success: false,
				error: error.message === 'Failed to fetch' ? 'CONNECTIVITY_ERROR' : error.message,
			};
		}
		return {
			success: false,
			error: 'Unknown network error',
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
