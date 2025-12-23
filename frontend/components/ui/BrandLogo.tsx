import React from 'react';
import { motion } from 'framer-motion';

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
	<motion.div
		whileHover={{ rotate: 5, scale: 1.05 }}
		whileTap={{ scale: 0.95 }}
		className="inline-block"
	>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="brandBgGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#00CC99" />
					<stop offset="1" stopColor="#008060" />
				</linearGradient>
			</defs>

			{/* Background (Sharp Corners) */}
			<rect width="24" height="24" fill="url(#brandBgGradient)" />

			{/* Simplified Stadium Bowl (Curvy) */}
			<path d="M0 16C4 14 20 14 24 16V24H0V16Z" fill="#005C45" opacity="0.6" />

			{/* Wickets (Simplified) */}
			<g transform="translate(10, 12)">
				<rect x="0" y="0" width="1" height="8" fill="#F8F9FA" />
				<rect x="2" y="0" width="1" height="8" fill="#F8F9FA" />
				<rect x="4" y="0" width="1" height="8" fill="#F8F9FA" />
				<path d="M-0.5 -1Q2.5 -2.5 5.5 -1" stroke="#F8F9FA" strokeWidth="0.5" fill="none" />
			</g>

			{/* Rain (Minimalist) */}
			<g opacity="0.5">
				<path d="M4 4Q3.5 6 3 8" stroke="#A5F3FC" strokeWidth="0.5" fill="none" />
				<path d="M18 3Q17.5 5 17 7" stroke="#A5F3FC" strokeWidth="0.5" fill="none" />
				<path d="M20 12Q19.5 14 19 16" stroke="#A5F3FC" stroke-width="0.5" fill="none" />
			</g>
		</svg>
	</motion.div>
);
