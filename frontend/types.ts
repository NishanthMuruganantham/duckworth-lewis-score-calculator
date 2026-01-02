export enum MatchFormat {
	ODI = 'ODI',
	T20 = 'T20',
	T10 = 'T10',
}

export enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
}

export enum ScenarioType {
	DELAYED_INN_2 = 'SecondInningsDelayed',
	CURTAILED_INN_2 = 'SecondInningsCurtailed',
	INTERRUPTED_INN_2 = 'SecondInningsInterrupted',
	CURTAILED_INN_1 = 'FirstInningsCurtailed',
	INTERRUPTED_INN_1 = 'FirstInningsInterrupted',
}

export interface CalculationPayload {
	scenario_type: ScenarioType;
	match_format: MatchFormat;
	inputs: Record<string, number | string>;
}

export interface CalculationResponse {
	success: boolean;
	data?: {
		parScore?: number;
		revisedTarget?: number;
		team1AdjustedTotal?: number;
		messages?: string[];
	};
	error?: string;
}

// Pandas "split" format
export interface ResourceTableSplit {
	columns: string[];
	data: (string | number)[][];
}

// Pandas "records" format
export type ResourceTableRecords = Record<string, string | number>[];

export type ResourceTableResponse = ResourceTableSplit | ResourceTableRecords;

export interface PrivacyPolicyContactInfo {
	email: string;
	appName: string;
	purpose: string;
}

export interface PrivacyPolicySection {
	id: number;
	title: string;
	content: string[];
	items?: string[];
	footer?: string;
	contactInfo?: PrivacyPolicyContactInfo;
}

export interface PrivacyPolicyResponse {
	title: string;
	lastUpdated: string;
	sections: PrivacyPolicySection[];
	summary: {
		title: string;
		content: string;
	};
}
