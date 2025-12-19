import React from 'react';

interface AppIconProps {
	className?: string;
	size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ className = "w-32 h-32", size = 512 }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 512 512"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<defs>
				<linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#045b5c" />
					<stop offset="100%" stopColor="#013133" />
				</linearGradient>

				<clipPath id="appIconClip">
					<rect x="0" y="0" width="512" height="512" rx="80" />
				</clipPath>
			</defs>

			<rect
				x="0"
				y="0"
				width="512"
				height="512"
				rx="80"
				fill="url(#iconGradient)"
			/>
			<rect
				x="0"
				y="0"
				width="512"
				height="512"
				rx="80"
				fill="url(#iconGradient)"
			/>

			<g clipPath="url(#appIconClip)">
				<g transform="translate(60, 60)">
					<circle cx="60" cy="60" r="50" fill="#2eb0ae" fillOpacity="0.6" />
					<path
						d="M30 60 C30 30 90 30 90 60 C90 90 30 90 30 60"
						stroke="white"
						strokeWidth="2"
						strokeOpacity="0.4"
						fill="none"
					/>
					<path
						d="M20 50 C20 20 100 20 100 50"
						stroke="white"
						strokeWidth="3"
						strokeLinecap="round"
						strokeOpacity="0.8"
						fill="none"
					/>
					<path
						d="M20 70 C20 100 100 100 100 70"
						stroke="white"
						strokeWidth="3"
						strokeLinecap="round"
						strokeOpacity="0.8"
						fill="none"
					/>
				</g>

				{/* Rain Droplets */}
				<g fill="white" fillOpacity="0.5">
					<path d="M250 120 c0 5 -4 9 -9 9 s-9 -4 -9 -9 c0 -5 9 -20 9 -20 s9 15 9 20 z" />
					<path d="M320 160 c0 4 -3 7 -7 7 s-7 -3 -7 -7 c0 -4 7 -15 7 -15 s7 11 7 15 z" />
					<path d="M210 180 c0 4 -3 7 -7 7 s-7 -3 -7 -7 c0 -4 7 -15 7 -15 s7 11 7 15 z" />
					<path d="M280 200 c0 3 -2 5 -5 5 s-5 -2 -5 -5 c0 -3 5 -12 5 -12 s5 9 5 12 z" />
					<path d="M350 240 c0 5 -4 9 -9 9 s-9 -4 -9 -9 c0 -5 9 -20 9 -20 s9 15 9 20 z" />
					<path d="M190 260 c0 3 -2 5 -5 5 s-5 -2 -5 -5 c0 -3 5 -12 5 -12 s5 9 5 12 z" />
				</g>

				{/* Bottom Flowing Waves */}
				<path
					d="M0 450 Q128 400 256 450 T512 450 V512 H0 Z"
					fill="#2eb0ae"
					fillOpacity="0.6"
				/>
				<path
					d="M0 480 Q128 440 256 480 T512 480 V512 H0 Z"
					fill="#4edcd9"
					fillOpacity="0.8"
				/>

				{/* Analytics Zig-Zag Graph */}
				<path
					d="M100 350 L200 280 L300 330 L400 220 L512 200"
					stroke="white"
					strokeWidth="16"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
};
