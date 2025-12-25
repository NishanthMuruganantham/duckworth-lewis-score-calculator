import React from 'react';

interface AppIconProps {
	className?: string;
	size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ className = "w-32 h-32", size = 512 }) => {
	return (
		<img
			src="/icon-512.png"
			alt="DLS Calculator Logo"
			width={size}
			height={size}
			className={`${className} object-contain rounded-lg`}
		/>
	);
};
