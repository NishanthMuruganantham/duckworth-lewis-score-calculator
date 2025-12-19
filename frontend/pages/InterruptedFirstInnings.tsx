import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDLS } from '../services/dlsApi';
import { ScenarioType, MatchFormat } from '../types';
import StadiumLoader from '../components/ui/StadiumLoader';
import { WicketError } from '../components/ui/WicketError';
import { HelpCircle, X, ArrowRight, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconInn1Interrupted } from '../components/ui/CricketIcons';

interface FormState {
	overs_available_to_team_1_at_start: number | '';
	overs_used_by_team_1_during_interruption: number | '';
	wickets_lost_by_team_1_during_interruption: number | '';
	revised_overs_to_team_1_after_resumption: number | '';
	runs_scored_by_team_1: number | '';
	overs_available_to_team_2_at_start: number | '';
}

const InterruptedFirstInnings: React.FC = () => {
	const { matchFormat, setIsCalculating } = useApp();
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [apiError, setApiError] = useState<string | null>(null);
	const [showRules, setShowRules] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [formData, setFormData] = useState<FormState>({
		overs_available_to_team_1_at_start: '',
		overs_used_by_team_1_during_interruption: '',
		wickets_lost_by_team_1_during_interruption: '',
		revised_overs_to_team_1_after_resumption: '',
		runs_scored_by_team_1: '',
		overs_available_to_team_2_at_start: '',
	});

	useEffect(() => {
		setResult(null);
		setApiError(null);
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
			else if (start > maxOvers) newErrors.overs_available_to_team_1_at_start = `Cannot exceed ${maxOvers} overs`;
		}

		if (data.overs_used_by_team_1_during_interruption !== '') {
			const intr = Number(data.overs_used_by_team_1_during_interruption);
			if (!validateOvers(data.overs_used_by_team_1_during_interruption)) newErrors.overs_used_by_team_1_during_interruption = "Invalid format (.0-.5)";
			if (data.overs_available_to_team_1_at_start !== '' && intr >= Number(data.overs_available_to_team_1_at_start)) newErrors.overs_used_by_team_1_during_interruption = "Must be less than starting overs";
		}

		if (data.wickets_lost_by_team_1_during_interruption !== '') {
			const w = Number(data.wickets_lost_by_team_1_during_interruption);
			if (w < 0 || w > 10) newErrors.wickets_lost_by_team_1_during_interruption = "Must be 0-10";
		}

		if (data.revised_overs_to_team_1_after_resumption !== '') {
			const rev = Number(data.revised_overs_to_team_1_after_resumption);
			if (!validateOvers(data.revised_overs_to_team_1_after_resumption)) newErrors.revised_overs_to_team_1_after_resumption = "Invalid format (.0-.5)";
			if (data.overs_used_by_team_1_during_interruption !== '' && rev < Number(data.overs_used_by_team_1_during_interruption)) newErrors.revised_overs_to_team_1_after_resumption = "Cannot be less than overs bowled";
			if (data.overs_available_to_team_1_at_start !== '' && rev > Number(data.overs_available_to_team_1_at_start)) newErrors.revised_overs_to_team_1_after_resumption = "Cannot exceed starting overs";
		}

		if (data.overs_available_to_team_2_at_start !== '') {
			if (!validateOvers(data.overs_available_to_team_2_at_start)) newErrors.overs_available_to_team_2_at_start = "Invalid format (.0-.5)";
			const oversAvailableToTeam2AtStart = Number(data.overs_available_to_team_2_at_start);
			const rev = Number(data.revised_overs_to_team_1_after_resumption);
			if (oversAvailableToTeam2AtStart > maxOvers) newErrors.overs_available_to_team_2_at_start = `Cannot exceed ${maxOvers} overs`;
			if (oversAvailableToTeam2AtStart > rev) newErrors.overs_available_to_team_2_at_start = "Cannot exceed revised overs to team 1";
		}

		if (data.runs_scored_by_team_1 !== '' && Number(data.runs_scored_by_team_1) < 0) newErrors.runs_scored_by_team_1 = "Cannot be negative";

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
			overs_used_by_team_1_during_interruption: '',
			wickets_lost_by_team_1_during_interruption: '',
			revised_overs_to_team_1_after_resumption: '',
			runs_scored_by_team_1: '',
			overs_available_to_team_2_at_start: '',
		});
		setApiError(null);
		setResult(null);
		setErrors({});
	};

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!validateForm(formData)) return;
		setLoading(true);
		setIsCalculating(true);
		setApiError(null);
		setResult(null);

		const payload = {
			scenario_type: ScenarioType.INTERRUPTED_INN_1,
			match_format: matchFormat,
			inputs: {
				overs_available_to_team_1_at_start: Number(formData.overs_available_to_team_1_at_start),
				overs_used_by_team_1_during_interruption: Number(formData.overs_used_by_team_1_during_interruption),
				wickets_lost_by_team_1_during_interruption: Number(formData.wickets_lost_by_team_1_during_interruption),
				revised_overs_to_team_1_after_resumption: Number(formData.revised_overs_to_team_1_after_resumption),
				runs_scored_by_team_1: Number(formData.runs_scored_by_team_1),
				overs_available_to_team_2_at_start: Number(formData.overs_available_to_team_2_at_start),
			},
		};

		try {
			const response = await calculateDLS(payload);
			if (response.success && response.data) setResult(response.data);
			else setApiError(response.error || "Calculation failed");
		} catch (err) {
			setApiError("Network error.");
		} finally {
			setLoading(false);
			setIsCalculating(false);
		}
	};

	const isFormComplete = Object.values(formData).every(val => val !== '');
	const hasErrors = Object.keys(errors).length > 0;
	const inputBaseClass = "w-full px-4 py-2 rounded-lg border bg-slate-50 dark:bg-slate-800 outline-none transition-all focus:ring-1 focus:ring-emerald-500/10";

	const getInputBorderClass = (field: string) => {
		if (errors[field]) return "border-red-500 focus:border-red-500 dark:border-red-900 focus:ring-red-500/10";
		return "border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500";
	};

	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
				<div className="flex items-start justify-between">
					<div className="flex items-start space-x-4">
						<div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl"><div className="w-6 h-6 flex items-center justify-center"><IconInn1Interrupted className="w-6 h-6" /></div></div>
						<div>
							<div className="flex items-center space-x-2"><h2 className="text-xl font-bold text-slate-800 dark:text-white">Interrupted 1st Innings</h2><button onClick={() => setShowRules(!showRules)} className="p-1 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"><HelpCircle className="w-4 h-4" /></button></div>
							<p className="text-slate-500 text-sm mt-1">Adjustments for interrupted 1st innings. Format: <span className="font-bold text-emerald-600">{matchFormat}</span></p>
						</div>
					</div>
				</div>
				<AnimatePresence>
					{showRules && (
						<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800 mt-4">
							<div className="p-4 relative text-sm text-indigo-700 dark:text-indigo-300">
								<button onClick={() => setShowRules(false)} className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600"><X className="w-4 h-4" /></button>
								<h4 className="font-bold mb-1">Logic</h4>
								Calculates resources lost when 1st innings is reduced. Compares resources Team 1 had vs what they finished with.
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
								<h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Match Settings</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Team 1 Starting Overs</label>
										<input type="number" step="0.1" name="overs_available_to_team_1_at_start" value={formData.overs_available_to_team_1_at_start} onChange={handleInputChange} className={`${inputBaseClass} ${getInputBorderClass('overs_available_to_team_1_at_start')}`} placeholder={`Max ${getMaxOvers()} Overs`} required />
										{errors.overs_available_to_team_1_at_start && <p className="text-xs text-red-500 mt-1">{errors.overs_available_to_team_1_at_start}</p>}
									</div>
								</div>
							</div>
							<div className="h-px bg-slate-100 dark:bg-slate-800 md:col-span-2 my-2" />
							<div className="space-y-4 md:col-span-2">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">At Interruption</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Overs Used</label>
										<input type="number" step="0.1" name="overs_used_by_team_1_during_interruption" value={formData.overs_used_by_team_1_during_interruption} onChange={handleInputChange} className={`${inputBaseClass} ${getInputBorderClass('overs_used_by_team_1_during_interruption')}`} placeholder={`Up to ${getMaxOvers()} Overs`} required />
										{errors.overs_used_by_team_1_during_interruption && <p className="text-xs text-red-500 mt-1">{errors.overs_used_by_team_1_during_interruption}</p>}
									</div>
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Wickets Lost</label>
										<input type="number" name="wickets_lost_by_team_1_during_interruption" value={formData.wickets_lost_by_team_1_during_interruption} onChange={handleInputChange} className={`${inputBaseClass} ${getInputBorderClass('wickets_lost_by_team_1_during_interruption')}`} placeholder="0-10" required />
										{errors.wickets_lost_by_team_1_during_interruption && <p className="text-xs text-red-500 mt-1">{errors.wickets_lost_by_team_1_during_interruption}</p>}
									</div>
								</div>
							</div>
							<div className="h-px bg-slate-100 dark:bg-slate-800 md:col-span-2 my-2" />
							<div className="space-y-4 md:col-span-2">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Resumption & Final</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Revised Team 1 Overs</label>
										<input type="number" step="0.1" name="revised_overs_to_team_1_after_resumption" value={formData.revised_overs_to_team_1_after_resumption} onChange={handleInputChange} className={`${inputBaseClass} ${getInputBorderClass('revised_overs_to_team_1_after_resumption')}`} placeholder={`Max ${getMaxOvers()} Overs`} required />
										{errors.revised_overs_to_team_1_after_resumption && <p className="text-xs text-red-500 mt-1">{errors.revised_overs_to_team_1_after_resumption}</p>}
									</div>
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Team 1 Final Score</label>
										<input type="number" name="runs_scored_by_team_1" value={formData.runs_scored_by_team_1} onChange={handleInputChange} className={`${inputBaseClass} ${getInputBorderClass('runs_scored_by_team_1')}`} placeholder="Total runs scored" required />
										{errors.runs_scored_by_team_1 && <p className="text-xs text-red-500 mt-1">{errors.runs_scored_by_team_1}</p>}
									</div>
									<div className="h-px bg-slate-100 dark:bg-slate-800 md:col-span-2 my-2" />
									<div className="space-y-1">
										<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Team 2 Overs Available</label>
										<input type="number" step="0.1" name="overs_available_to_team_2_at_start" value={formData.overs_available_to_team_2_at_start} onChange={handleInputChange} className={`${inputBaseClass} ${getInputBorderClass('overs_available_to_team_2_at_start')}`} placeholder={`Max ${getMaxOvers()} Overs`} required />
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
							<StadiumLoader key="loader" message="Calculating Adjusted Target" loading={true} />
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
								<p className="text-sm">Enter interruption details to calculate.</p>
							</div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default InterruptedFirstInnings;
