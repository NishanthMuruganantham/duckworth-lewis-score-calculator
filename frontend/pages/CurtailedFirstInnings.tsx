import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDLS } from '../services/dlsApi';
import { ScenarioType, MatchFormat } from '../types';
import StadiumLoader from '../components/ui/StadiumLoader';
import { WicketError } from '../components/ui/WicketError';
import { ConnectionError } from '../components/ui/ConnectionError';
import { HelpCircle, X, ArrowRight, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconInn1Curtailed } from '../components/ui/CricketIcons';

interface FormState {
	overs_available_to_team_1_at_start: number | '';
	runs_scored_by_team_1: number | '';
	wickets_lost_by_team_1_during_curtailed: number | '';
	overs_used_by_team_1_during_curtailed: number | '';
	overs_available_to_team_2_at_start: number | '';
}
import SEO from '../components/seo/SEO';
import SEOContent from '../components/seo/SEOContent';

const CurtailedFirstInnings: React.FC = () => {
	const { matchFormat, setIsCalculating } = useApp();
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [apiError, setApiError] = useState<string | null>(null);
	const [isConnError, setIsConnError] = useState(false);
	const [showRules, setShowRules] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// SEO Content for this page
	const pageSEO = {
		title: 'Curtailed First Innings DLS Calculator',
		description: 'Calculate DLS par scores and targets when the first innings ends prematurely. Accurate cricket math for ODI and T20.',
		canonical: 'https://dls.nishanthm.com/curtailed-first-innings',
		schema: JSON.stringify([
			{
				"@context": "https://schema.org",
				"@type": "WebApplication",
				"name": "Curtailed 1st Innings DLS Calculator",
				"description": "Calculate targets for curtailed first innings in cricket.",
				"applicationCategory": "SportsApplication"
			}
		])
	};

	const seoText = {
		title: "Curtailed First Innings",
		description: `A curtailed first innings happens when the batting team's innings is finished earlier than planned, often due to a sudden downpour or light issues. Unlike an interruption where play might resume, curtailment means they won't bat again.
        
        The Duckworth–Lewis–Stern (DLS) method is vital here. It adjusts the target for the second innings to account for the 'lost' potential Team 1 had. If they had many wickets remaining, they were likely to score at an accelerated rate in the final overs.
        
        Use this DLS tool to accurately determine the revised target score for the chasing team in rain-affected games.`,
		faqs: [
			{
				question: "What happens if a match is curtailed?",
				answer: "If the first team's innings is curtailed, the second team's target is adjusted based on the resources both teams have available."
			},
			{
				question: "Why does the target increase after curtailment?",
				answer: "The target often increases because DLS assumes the first team would have scored more aggressively in their remaining overs if they hadn't been interrupted."
			}
		]
	};

	const [formData, setFormData] = useState<FormState>({
		overs_available_to_team_1_at_start: '',
		runs_scored_by_team_1: '',
		wickets_lost_by_team_1_during_curtailed: '',
		overs_used_by_team_1_during_curtailed: '',
		overs_available_to_team_2_at_start: '',
	});

	useEffect(() => {
		setResult(null);
		setApiError(null);
		setIsConnError(false);
		validateForm(formData);
	}, [matchFormat]);

	const getMaxOvers = () => {
		switch (matchFormat) {
			case MatchFormat.T10: return 10;
			case MatchFormat.T20: return 20;
			case MatchFormat.ODI: return 50;
			default: return 50;
		}
	};

	const validateOvers = (val: number | string): boolean => {
		if (val === '') return true;
		const num = Number(val);
		const decimal = Number((num % 1).toFixed(1));
		return decimal <= 0.5;
	};

	const validateForm = (data: FormState) => {
		const newErrors: Record<string, string> = {};
		const maxOvers = getMaxOvers();

		if (data.overs_available_to_team_1_at_start !== '') {
			const start = Number(data.overs_available_to_team_1_at_start);
			if (!validateOvers(data.overs_available_to_team_1_at_start)) newErrors.overs_available_to_team_1_at_start = "Invalid format (.0-.5)";
			else if (start > maxOvers) newErrors.overs_available_to_team_1_at_start = `Max ${maxOvers} overs allowed`;
		}

		if (data.runs_scored_by_team_1 !== '' && Number(data.runs_scored_by_team_1) < 0) newErrors.runs_scored_by_team_1 = "Cannot be negative";
		if (data.wickets_lost_by_team_1_during_curtailed !== '') {
			const w = Number(data.wickets_lost_by_team_1_during_curtailed);
			if (w < 0 || w > 9) newErrors.wickets_lost_by_team_1_during_curtailed = "Must be 0 - 9";
		}

		if (data.overs_used_by_team_1_during_curtailed !== '') {
			const used = Number(data.overs_used_by_team_1_during_curtailed);
			if (!validateOvers(data.overs_used_by_team_1_during_curtailed)) newErrors.overs_used_by_team_1_during_curtailed = "Invalid format (.0-.5)";
			if (data.overs_available_to_team_1_at_start !== '' && used > Number(data.overs_available_to_team_1_at_start)) newErrors.overs_used_by_team_1_during_curtailed = "Cannot exceed starting overs";
		}

		if (data.overs_available_to_team_2_at_start !== '') {
			const t2 = Number(data.overs_available_to_team_2_at_start);
			if (!validateOvers(data.overs_available_to_team_2_at_start)) newErrors.overs_available_to_team_2_at_start = "Invalid format (.0-.5)";
			if (data.overs_available_to_team_1_at_start !== '' && t2 > Number(data.overs_available_to_team_1_at_start)) newErrors.overs_available_to_team_2_at_start = "Cannot exceed Team 1 starting overs";
			if (data.overs_used_by_team_1_during_curtailed !== '' && t2 > Number(data.overs_used_by_team_1_during_curtailed)) newErrors.overs_available_to_team_2_at_start = "Cannot exceed overs used by Team 1";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
			const newData = { ...formData, [name]: value };
			setFormData(newData);
			validateForm(newData);
		}
	};

	const handleClearForm = () => {
		setFormData({
			overs_available_to_team_1_at_start: '',
			runs_scored_by_team_1: '',
			wickets_lost_by_team_1_during_curtailed: '',
			overs_used_by_team_1_during_curtailed: '',
			overs_available_to_team_2_at_start: '',
		});
		setApiError(null);
		setIsConnError(false);
		setResult(null);
		setErrors({});
	};

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!validateForm(formData)) return;
		setLoading(true);
		setIsCalculating(true);
		setApiError(null);
		setIsConnError(false);
		setResult(null);

		const payload = {
			scenario_type: ScenarioType.CURTAILED_INN_1,
			match_format: matchFormat,
			inputs: {
				overs_available_to_team_1_at_start: Number(formData.overs_available_to_team_1_at_start),
				runs_scored_by_team_1: Number(formData.runs_scored_by_team_1),
				wickets_lost_by_team_1_during_curtailed: Number(formData.wickets_lost_by_team_1_during_curtailed),
				overs_used_by_team_1_during_curtailed: Number(formData.overs_used_by_team_1_during_curtailed),
				overs_available_to_team_2_at_start: Number(formData.overs_available_to_team_2_at_start),
			},
		};

		try {
			const response = await calculateDLS(payload);
			if (response.success && response.data) {
				setResult(response.data);
			} else {
				if (response.error === 'CONNECTIVITY_ERROR') {
					setIsConnError(true);
				} else {
					setApiError(response.error || "Calculation failed");
				}
			}
		} catch (err) {
			setIsConnError(true);
		} finally {
			setLoading(false);
			setIsCalculating(false);
		}
	};

	const isFormComplete = Object.values(formData).every(val => val !== '');
	const hasErrors = Object.keys(errors).length > 0;
	const inputBaseClass = "w-full px-4 py-2 rounded-lg border bg-slate-50 dark:bg-slate-800 outline-none transition-all focus:ring-1 focus:ring-emerald-500/10 focus:scale-[1.01]";

	const getInputBorderClass = (field: string) => {
		if (errors[field]) return "border-red-500 focus:border-red-500 dark:border-red-900 focus:ring-red-500/10";
		return "border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500";
	};

	return (
		<main className="space-y-6">
			<SEO {...pageSEO} />
			<div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
				<div className="flex items-start justify-between">
					<div className="flex items-start space-x-4">
						<div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl"><IconInn1Curtailed className="w-6 h-6" /></div>
						<div>
							<div className="flex items-center space-x-2">
								<h1 className="text-xl font-bold text-slate-800 dark:text-white">Curtailed 1st Innings</h1>
								<button onClick={() => setShowRules(!showRules)} className="p-1 rounded-full text-slate-400 hover:text-amber-600 transition-colors"><HelpCircle className="w-4 h-4" /></button>
							</div>
							<p className="text-slate-500 text-sm mt-1">Calculate target when 1st innings terminates prematurely. Format: <span className="font-bold text-emerald-600">{matchFormat}</span></p>
						</div>
					</div>
				</div>
				<AnimatePresence>
					{showRules && (
						<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800 mt-4">
							<div className="p-4 relative text-sm text-amber-700 dark:text-amber-300">
								<button onClick={() => setShowRules(false)} className="absolute top-2 right-2 text-amber-400 hover:text-amber-600"><X className="w-4 h-4" /></button>
								<h4 className="font-bold mb-1">Resource Logic</h4>
								Adjusts target because Team 1 paced their innings for a longer match but were cut short with wickets remaining.
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4 md:col-span-2">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Match Conditions</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Team 1 Starting Overs</label>
										<input type="number" step="0.1" name="overs_available_to_team_1_at_start" value={formData.overs_available_to_team_1_at_start} onChange={handleInputChange} aria-label="Team 1 Starting Overs" className={`${inputBaseClass} ${getInputBorderClass('overs_available_to_team_1_at_start')}`} placeholder={`Max ${getMaxOvers()} Overs`} required />
										{errors.overs_available_to_team_1_at_start && <p className="text-xs text-red-500 mt-1">{errors.overs_available_to_team_1_at_start}</p>}
									</div>
								</div>
							</div>
							<div className="h-px bg-slate-100 dark:bg-slate-800 md:col-span-2 my-2" />
							<div className="space-y-4 md:col-span-2">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Team 1 (At Termination)</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Runs Scored</label>
										<input type="number" name="runs_scored_by_team_1" value={formData.runs_scored_by_team_1} onChange={handleInputChange} aria-label="Team 1 Total Runs" className={`${inputBaseClass} ${getInputBorderClass('runs_scored_by_team_1')}`} placeholder="e.g., 180" required />
										{errors.runs_scored_by_team_1 && <p className="text-xs text-red-500 mt-1">{errors.runs_scored_by_team_1}</p>}
									</div>
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Wickets Lost</label>
										<input type="number" name="wickets_lost_by_team_1_during_curtailed" value={formData.wickets_lost_by_team_1_during_curtailed} onChange={handleInputChange} aria-label="Team 1 Wickets Lost" className={`${inputBaseClass} ${getInputBorderClass('wickets_lost_by_team_1_during_curtailed')}`} placeholder="0 - 9" required />
										{errors.wickets_lost_by_team_1_during_curtailed && <p className="text-xs text-red-500 mt-1">{errors.wickets_lost_by_team_1_during_curtailed}</p>}
									</div>
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Overs Used</label>
										<input type="number" step="0.1" name="overs_used_by_team_1_during_curtailed" value={formData.overs_used_by_team_1_during_curtailed} onChange={handleInputChange} aria-label="Team 1 Overs Used" className={`${inputBaseClass} ${getInputBorderClass('overs_used_by_team_1_during_curtailed')}`} placeholder={`Up to ${getMaxOvers()} Overs`} required />
										{errors.overs_used_by_team_1_during_curtailed && <p className="text-xs text-red-500 mt-1">{errors.overs_used_by_team_1_during_curtailed}</p>}
									</div>
								</div>
							</div>
							<div className="h-px bg-slate-100 dark:bg-slate-800 md:col-span-2 my-2" />
							<div className="space-y-4 md:col-span-2">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Team 2 Conditions</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Team 2 Overs Available</label>
										<input type="number" step="0.1" name="overs_available_to_team_2_at_start" value={formData.overs_available_to_team_2_at_start} onChange={handleInputChange} aria-label="Team 2 Available Overs" className={`${inputBaseClass} ${getInputBorderClass('overs_available_to_team_2_at_start')}`} placeholder={`Max ${getMaxOvers()} Overs`} required />
										{errors.overs_available_to_team_2_at_start && <p className="text-xs text-red-500 mt-1">{errors.overs_available_to_team_2_at_start}</p>}
									</div>
								</div>
							</div>
						</div>
						<div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
							<button type="submit" disabled={loading || !isFormComplete || hasErrors} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"><Save className="w-5 h-5" /><span>Calculate Target</span></button>
						</div>
					</form>
				</div>
				<div className="lg:col-span-1 relative min-h-[350px]">
					<AnimatePresence mode="wait">
						{loading ? (
							<StadiumLoader key="loader" message="Calculating Adjusted Total" loading={true} />
						) : isConnError ? (
							<ConnectionError key="conn-error" onRetry={() => handleSubmit()} />
						) : apiError ? (
							<WicketError key="error" onRetry={() => handleSubmit()} onBack={handleClearForm} message={apiError} />
						) : result ? (
							<StadiumLoader
								key="result"
								loading={false}
								results={{
									targetScore: result.revisedTarget,
									adjustedTotal: result.parScore
								}}
							/>
						) : (
							<div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
								<ArrowRight className="w-6 h-6 text-slate-400 mb-2" />
								<p className="text-sm">Enter 1st innings stats to calculate.</p>
							</div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<SEOContent {...seoText} />
		</main>
	);
};

export default CurtailedFirstInnings;
