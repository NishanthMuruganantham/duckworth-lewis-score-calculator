import React from 'react';
import { motion } from 'framer-motion';
import { AppIcon } from './AppIcon';

export const SplashScreen: React.FC = () => {
	const containerVariants = {
		exit: {
			opacity: 0,
			scale: 1.1,
			filter: "blur(10px)",
			transition: {
				duration: 0.8,
				ease: [0.43, 0.13, 0.23, 0.96]
			}
		}
	};

	const childVariants = {
		initial: { y: 20, opacity: 0 },
		animate: { y: 0, opacity: 1 },
	};

	return (
		<motion.div
			variants={containerVariants}
			exit="exit"
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 100,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: '#5ba350',
				overflow: 'hidden',
			}}
		>
			{/* Dynamic Background Decorative Element */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.1 }}
				transition={{ duration: 2 }}
				style={{
					position: 'absolute',
					inset: 0,
					pointerEvents: 'none',
				}}
			>
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
						<path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
					</pattern>
					<rect width="100" height="100" fill="url(#grid)" />
				</svg>
			</motion.div>

			<div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{/* Logo Entrance */}
				<motion.div
					initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
					animate={{ scale: 1, opacity: 1, rotate: 0 }}
					transition={{
						type: "spring",
						stiffness: 120,
						damping: 20,
						duration: 1
					}}
					style={{ position: 'relative' }}
				>
					<div style={{
						position: 'absolute',
						inset: 0,
						filter: 'blur(48px)',
						background: 'rgba(255, 255, 255, 0.3)',
						borderRadius: '50%',
						transform: 'scale(1.5)',
						animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
					}} />
					<AppIcon
						size={512}
						style={{
							width: window.innerWidth < 768 ? '8rem' : '10rem',
							height: window.innerWidth < 768 ? '8rem' : '10rem',
							boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
							borderRadius: '32px',
							position: 'relative',
							zIndex: 10,
						}}
					/>
				</motion.div>

				{/* Text Animation with Stagger */}
				<motion.div
					initial="initial"
					animate="animate"
					transition={{ delayChildren: 0.5, staggerChildren: 0.15 }}
					style={{ marginTop: '2rem', textAlign: 'center' }}
				>
					<motion.h1
						variants={childVariants}
						style={{
							fontSize: '2.25rem',
							fontWeight: 900,
							color: '#ffffff',
							letterSpacing: '-0.05em',
							filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
							margin: 0,
						}}
					>
						DLS <span style={{ opacity: 0.8 }}>Calculator</span>
					</motion.h1>

					<motion.div
						variants={childVariants}
						style={{
							marginTop: '0.5rem',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '0.75rem',
						}}
					>
						<span style={{ height: '1px', width: '1.5rem', background: 'rgba(255, 255, 255, 0.4)' }} />
						<p style={{
							fontSize: '10px',
							fontWeight: 900,
							textTransform: 'uppercase',
							letterSpacing: '0.5em',
							color: 'rgba(255, 255, 255, 0.8)',
							margin: 0,
						}}>
							Analytical Engine
						</p>
						<span style={{ height: '1px', width: '1.5rem', background: 'rgba(255, 255, 255, 0.4)' }} />
					</motion.div>
				</motion.div>
			</div>

			{/* Modern Progress Loader */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 1 }}
				style={{
					position: 'absolute',
					bottom: '4rem',
					left: '50%',
					transform: 'translateX(-50%)',
					width: '12rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
				}}
			>
				<div style={{
					height: '0.375rem',
					width: '100%',
					background: 'rgba(255, 255, 255, 0.2)',
					borderRadius: '9999px',
					overflow: 'hidden',
					backdropFilter: 'blur(4px)',
				}}>
					<motion.div
						initial={{ x: '-100%' }}
						animate={{ x: '100%' }}
						transition={{
							repeat: Infinity,
							duration: 2,
							ease: "easeInOut"
						}}
						style={{
							height: '100%',
							width: '100%',
							background: 'linear-gradient(to right, transparent, white, transparent)',
						}}
					/>
				</div>
				<p style={{
					fontSize: '10px',
					fontWeight: 700,
					color: 'rgba(255, 255, 255, 0.6)',
					textAlign: 'center',
					textTransform: 'uppercase',
					letterSpacing: '0.3em',
					animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
					margin: 0,
				}}>
					Syncing Data...
				</p>
			</motion.div>

			{/* Version Tag & Credits */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.4 }}
				transition={{ delay: 1.5 }}
				style={{
					position: 'absolute',
					bottom: '2rem',
					textAlign: 'center',
					display: 'flex',
					flexDirection: 'column',
					gap: '0.25rem',
				}}
			>
				<p style={{
					fontSize: '9px',
					fontWeight: 700,
					color: '#ffffff',
					textTransform: 'uppercase',
					letterSpacing: '0.25em',
					margin: 0,
				}}>
					Precision Metrics v4.0
				</p>
				<p style={{
					fontSize: '8px',
					fontWeight: 500,
					color: 'rgba(255, 255, 255, 0.6)',
					letterSpacing: '0.2em',
					margin: 0,
				}}>
					Crafted by Nishanth
				</p>
			</motion.div>

			{/* CSS keyframes for pulse animation */}
			<style>{`
				@keyframes pulse {
					0%, 100% {
						opacity: 1;
					}
					50% {
						opacity: 0.5;
					}
				}
			`}</style>
		</motion.div>
	);
};
