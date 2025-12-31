import React from 'react';

interface AppIconProps {
	className?: string;
	size?: number;
	style?: React.CSSProperties;
}

export const AppIcon: React.FC<AppIconProps> = ({ className = "w-32 h-32", size = 512, style = {} }) => {
	// If style prop is provided, use it; otherwise fall back to className for backward compatibility
	const finalStyle: React.CSSProperties = Object.keys(style).length > 0
		? { objectFit: 'contain', borderRadius: '0.5rem', ...style }
		: {};

	return (
		<img
			src="/icon-512.png"
			alt="DLS Calculator Logo"
			width={size}
			height={size}
			className={Object.keys(style).length > 0 ? undefined : `${className} object-contain rounded-lg`}
			style={Object.keys(style).length > 0 ? finalStyle : undefined}
		/>
	);
};
