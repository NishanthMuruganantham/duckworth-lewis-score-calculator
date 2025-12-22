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
			<rect width="24" height="24" rx="4.5" fill="#045b5c" />

			<g clipPath="inset(0 0 0 0 round 4.5px)">
				{/* Simplified Wave Bottom */}
				<path
					d="M0 18 Q6 16 12 18 T24 18 V24 H0 Z"
					fill="#2eb0ae"
					fillOpacity="0.8"
				/>

				{/* Simplified Ball */}
				<circle cx="5" cy="5" r="3" fill="#4edcd9" fillOpacity="0.6" />

				{/* Graph Line */}
				<path
					d="M6 15 L10 12 L14 14 L19 9"
					stroke="white"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>

				{/* Minimal Drop */}
				<circle cx="12" cy="7" r="1" fill="white" fillOpacity="0.5" />
			</g>
		</svg>
	</motion.div>
);
