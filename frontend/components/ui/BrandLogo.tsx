import React from 'react';
import { motion } from 'framer-motion';

export const BrandLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
	<motion.div
		whileHover={{ rotate: 5, scale: 1.05 }}
		whileTap={{ scale: 0.95 }}
		className="inline-block"
	>
		<img
			src="/icon-512.png"
			alt="DLS Calculator Logo"
			className={`${className} object-contain rounded-lg`}
		/>
	</motion.div>
);
