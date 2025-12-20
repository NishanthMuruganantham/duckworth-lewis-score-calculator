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

			if (response.status === 400) {
				throw new Error('Invalid inputs detected. Please verify your inputs and try again.');
			}

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
	try {
		const response = await fetchWithTimeout(
			`${BASE_URL}/resource-table/?match_format=${format}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			},
			NETWORK_CONFIG.API_CALL_TIMEOUT
		);

		if (!response.ok) {
			const errorData = await response.json();

			if (response.status === 400) {
				throw new Error('Invalid inputs detected. Please verify your inputs and try again.');
			}

			throw new Error(errorData.message || 'Failed to fetch resource table');
		}

		const data = await response.json();
		return {
			columns: data.columns,
			data: data.data,
		};
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				console.error('Resource Table Timeout');
				return {
					columns: [],
					data: [],
				};
			}
			console.error('Resource Table Error:', error);
			return {
				columns: [],
				data: [],
			};
		}
		return {
			columns: [],
			data: [],
		};
	}
};
