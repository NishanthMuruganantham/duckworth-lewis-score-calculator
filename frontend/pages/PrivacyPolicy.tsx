import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPrivacyPolicy } from '../services/dlsApi';
import { PrivacyPolicyResponse } from '../types';

const PrivacyPolicy: React.FC = () => {
	const [policy, setPolicy] = useState<PrivacyPolicyResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getPolicy = async () => {
			const data = await fetchPrivacyPolicy();
			setPolicy(data);
			setLoading(false);
		};
		getPolicy();
	}, []);

	if (loading) {
		return (
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '50vh',
				color: '#059669',
			}}>
				<div className="animate-pulse">Loading Privacy Policy...</div>
			</div>
		);
	}

	if (!policy) {
		return (
			<div style={{
				maxWidth: '800px',
				margin: '0 auto',
				padding: '2rem 1.5rem',
				textAlign: 'center',
				color: '#ef4444',
			}}>
				Failed to load privacy policy. Please try again later.
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			style={{
				maxWidth: '800px',
				margin: '0 auto',
				padding: '2rem 1.5rem',
			}}
		>
			<h1 style={{
				fontSize: '2rem',
				fontWeight: '700',
				color: '#059669',
				marginBottom: '1rem',
			}}>
				{policy.title}
			</h1>

			<div style={{
				fontSize: '0.875rem',
				color: '#94a3b8',
				marginBottom: '2rem',
			}}>
				Last Updated: {policy.lastUpdated}
			</div>

			<div style={{
				lineHeight: '1.75',
				color: '#64748b',
				fontSize: '1rem',
			}}>
				{policy.sections.map((section) => (
					<section key={section.id} style={{ marginBottom: '2rem' }}>
						<h2 style={{
							fontSize: '1.5rem',
							fontWeight: '600',
							color: '#10b981',
							marginBottom: '1rem',
						}}>
							{section.title}
						</h2>
						{section.content.map((p, idx) => (
							<p key={idx} style={{ marginBottom: '1rem' }} dangerouslySetInnerHTML={{ __html: p }} />
						))}

						{section.items && (
							<ul style={{
								listStyle: 'disc',
								paddingLeft: '2rem',
								marginBottom: '1rem',
							}}>
								{section.items.map((item, idx) => (
									<li key={idx} style={{ marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: item }} />
								))}
							</ul>
						)}

						{section.footer && (
							<p style={{ marginBottom: '1rem' }}>{section.footer}</p>
						)}

						{section.contactInfo && (
							<div style={{
								background: 'rgba(16, 185, 129, 0.1)',
								border: '1px solid rgba(16, 185, 129, 0.3)',
								borderRadius: '0.5rem',
								padding: '1rem',
								marginTop: '1rem',
							}}>
								<p style={{ marginBottom: '0.5rem' }}>
									<strong style={{ color: '#10b981' }}>Email:</strong> <a href={`mailto:${section.contactInfo.email}`} style={{ color: '#059669', textDecoration: 'none' }}>{section.contactInfo.email}</a>
								</p>
								<p style={{ marginBottom: '0.5rem' }}>
									<strong style={{ color: '#10b981' }}>App Name:</strong> {section.contactInfo.appName}
								</p>
								<p>
									<strong style={{ color: '#10b981' }}>Purpose:</strong> {section.contactInfo.purpose}
								</p>
							</div>
						)}
					</section>
				))}

				{policy.summary && (
					<div style={{
						marginTop: '3rem',
						padding: '1.5rem',
						background: 'rgba(5, 150, 105, 0.1)',
						border: '1px solid rgba(5, 150, 105, 0.3)',
						borderRadius: '0.75rem',
					}}>
						<h3 style={{
							fontSize: '1.25rem',
							fontWeight: '600',
							color: '#10b981',
							marginBottom: '0.75rem',
						}}>
							{policy.summary.title}
						</h3>
						<p style={{ color: '#64748b' }}>
							{policy.summary.content}
						</p>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default PrivacyPolicy;
