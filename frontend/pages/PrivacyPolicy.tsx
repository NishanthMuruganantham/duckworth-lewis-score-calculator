import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
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
				Privacy Policy
			</h1>

			<div style={{
				fontSize: '0.875rem',
				color: '#94a3b8',
				marginBottom: '2rem',
			}}>
				Last Updated: January 1, 2026
			</div>

			<div style={{
				lineHeight: '1.75',
				color: '#64748b',
				fontSize: '1rem',
			}}>
				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						1. Introduction
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						Welcome to DLS Calculator ("we," "our," or "us"). This privacy policy explains how we handle information when you use our Duckworth-Lewis-Stern (DLS) calculator application (the "App").
					</p>
					<p style={{ marginBottom: '1rem' }}>
						We are committed to protecting your privacy. This App is designed to provide DLS score calculations for cricket matches without collecting, storing, or sharing any personal data.
					</p>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						2. Information We Do NOT Collect
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						Our App is designed with privacy in mind. We do NOT collect, store, or transmit:
					</p>
					<ul style={{
						listStyle: 'disc',
						paddingLeft: '2rem',
						marginBottom: '1rem',
					}}>
						<li style={{ marginBottom: '0.5rem' }}>Personal information (name, email, phone number, etc.)</li>
						<li style={{ marginBottom: '0.5rem' }}>Device identifiers or advertising IDs</li>
						<li style={{ marginBottom: '0.5rem' }}>Location data</li>
						<li style={{ marginBottom: '0.5rem' }}>Usage analytics or tracking data</li>
						<li style={{ marginBottom: '0.5rem' }}>Cookies or similar tracking technologies</li>
						<li style={{ marginBottom: '0.5rem' }}>Photos, videos, or other media files</li>
						<li style={{ marginBottom: '0.5rem' }}>Contact information or address book data</li>
					</ul>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						3. How the App Works
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						The DLS Calculator operates entirely as a calculation tool:
					</p>
					<ul style={{
						listStyle: 'disc',
						paddingLeft: '2rem',
						marginBottom: '1rem',
					}}>
						<li style={{ marginBottom: '0.5rem' }}>
							<strong>Input Processing:</strong> You enter match data (overs, wickets, runs, etc.) which is processed locally on your device or through our calculation API.
						</li>
						<li style={{ marginBottom: '0.5rem' }}>
							<strong>Calculations:</strong> The App performs DLS calculations using the standard DLS method formulas.
						</li>
						<li style={{ marginBottom: '0.5rem' }}>
							<strong>Results Display:</strong> Calculated results are displayed to you immediately.
						</li>
						<li style={{ marginBottom: '0.5rem' }}>
							<strong>No Data Storage:</strong> We do not store your calculation inputs or results on our servers.
						</li>
					</ul>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						4. Internet Connectivity
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						This App requires an internet connection to:
					</p>
					<ul style={{
						listStyle: 'disc',
						paddingLeft: '2rem',
						marginBottom: '1rem',
					}}>
						<li style={{ marginBottom: '0.5rem' }}>Access our calculation API for DLS score computations</li>
						<li style={{ marginBottom: '0.5rem' }}>Retrieve the DLS resource table data</li>
						<li style={{ marginBottom: '0.5rem' }}>Check app health and connectivity status</li>
					</ul>
					<p style={{ marginBottom: '1rem' }}>
						While API requests are made to perform calculations, no personal or identifying information is transmitted. Only the cricket match parameters you input are sent for calculation purposes.
					</p>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						5. Third-Party Services
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						Our App does not integrate with any third-party services, analytics platforms, or advertising networks. We do not share any information with third parties because we do not collect any information to share.
					</p>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						6. Children's Privacy
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						Our App is suitable for all ages and does not collect any information from anyone, including children under 13 years of age. We comply with the Children's Online Privacy Protection Act (COPPA) and similar regulations worldwide by not collecting any personal information whatsoever.
					</p>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						7. Data Security
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						Since we do not collect, store, or transmit any personal data, there is no personal information at risk. The calculation data you input is processed in real-time and is not stored on our servers.
					</p>
					<p style={{ marginBottom: '1rem' }}>
						API communications are conducted over secure HTTPS connections to ensure the integrity of data transmission.
					</p>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						8. Your Rights
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						Since we do not collect any personal data, there is no user data to access, modify, delete, or export. You maintain complete control over your device and can uninstall the App at any time.
					</p>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						9. Changes to This Privacy Policy
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						We may update this privacy policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically for any changes.
					</p>
					<p style={{ marginBottom: '1rem' }}>
						If we make material changes that affect how we handle data, we will notify users through the App or through the app store listing.
					</p>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						10. Contact Us
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						If you have any questions or concerns about this privacy policy or our privacy practices, please contact us at:
					</p>
					<div style={{
						background: 'rgba(16, 185, 129, 0.1)',
						border: '1px solid rgba(16, 185, 129, 0.3)',
						borderRadius: '0.5rem',
						padding: '1rem',
						marginTop: '1rem',
					}}>
						<p style={{ marginBottom: '0.5rem' }}>
							<strong style={{ color: '#10b981' }}>Email:</strong> <a href="mailto:nishanthmurugananth10@gmail.com" style={{ color: '#059669', textDecoration: 'none' }}>nishanthmurugananth10@gmail.com</a>
						</p>
						<p style={{ marginBottom: '0.5rem' }}>
							<strong style={{ color: '#10b981' }}>App Name:</strong> DLS Calculator
						</p>
						<p>
							<strong style={{ color: '#10b981' }}>Purpose:</strong> Duckworth-Lewis-Stern Score Calculator for Cricket
						</p>
					</div>
				</section>

				<section style={{ marginBottom: '2rem' }}>
					<h2 style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#10b981',
						marginBottom: '1rem',
					}}>
						11. Consent
					</h2>
					<p style={{ marginBottom: '1rem' }}>
						By using the DLS Calculator App, you consent to this privacy policy and agree to its terms. Since we do not collect any personal data, your use of the App does not involve the processing of any personal information.
					</p>
				</section>

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
						Summary
					</h3>
					<p style={{ color: '#64748b' }}>
						The DLS Calculator is a privacy-focused application that does not collect, store, or share any personal information. Your privacy is fully protected as we only process the cricket match data you input for calculation purposes, without retaining any information.
					</p>
				</div>
			</div>
		</motion.div>
	);
};

export default PrivacyPolicy;
