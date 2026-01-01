import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCcw } from 'lucide-react';

interface ConnectionErrorProps {
    onRetry: () => void;
    message?: string;
}

export const ConnectionError: React.FC<ConnectionErrorProps> = ({ onRetry, message }) => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '100%',
        minHeight: '500px',
        maxHeight: '650px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        boxSizing: 'border-box',
    };

    const iconContainerStyle: React.CSSProperties = {
        position: 'relative',
        width: '10rem',
        height: '10rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        flexShrink: 0,
    };

    const pulseRingStyle: React.CSSProperties = {
        position: 'absolute',
        width: '3rem',
        height: '3rem',
        border: '2px solid #10b981',
        borderRadius: '50%',
        pointerEvents: 'none',
    };

    const iconCenterStyle: React.CSSProperties = {
        position: 'relative',
        zIndex: 10,
        width: '3.5rem',
        height: '3.5rem',
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        borderRadius: '50%',
        boxShadow: '0 20px 40px -10px rgba(220, 38, 38, 0.6), 0 0 0 4px #7f1d1d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    };

    const iconOverlayStyle: React.CSSProperties = {
        position: 'absolute',
        inset: '0',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
    };

    const iconLineStyle: React.CSSProperties = {
        width: '100%',
        height: '0.25rem',
        background: 'rgba(255, 255, 255, 0.2)',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
    };

    const textContainerStyle: React.CSSProperties = {
        marginBottom: '2rem',
        padding: '0 1rem',
        flexShrink: 0,
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '1.25rem',
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: '-0.025em',
        textTransform: 'uppercase',
        marginBottom: '0.75rem',
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: '0.875rem',
        color: '#94a3b8',
        maxWidth: '280px',
        margin: '0 auto',
        lineHeight: '1.6',
    };

    const buttonStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        width: '100%',
        maxWidth: '220px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#ffffff',
        fontWeight: '700',
        fontSize: '0.9375rem',
        padding: '1rem 2rem',
        borderRadius: '1rem',
        border: 'none',
        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.6)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none',
        flexShrink: 0,
    };

    const badgeStyle: React.CSSProperties = {
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.25rem 0.75rem',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '9999px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        flexShrink: 0,
    };

    const dotStyle: React.CSSProperties = {
        width: '0.375rem',
        height: '0.375rem',
        borderRadius: '50%',
        background: '#64748b',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    };

    const badgeTextStyle: React.CSSProperties = {
        fontSize: '0.5625rem',
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(16, 185, 129, 0.8)';
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.6)';
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(0.95)';
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(1.02)';
    };

    return (
        <div style={containerStyle}>
            {/* Animated pulse rings */}
            <div style={iconContainerStyle}>
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 2.2, opacity: [0, 0.3, 0] }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "easeOut"
                        }}
                        style={pulseRingStyle}
                    />
                ))}

                {/* Icon center */}
                <div style={iconCenterStyle}>
                    <div style={iconOverlayStyle} />
                    <div style={iconLineStyle} />
                    <WifiOff style={{ width: '1.5rem', height: '1.5rem', color: 'rgba(255, 255, 255, 0.9)', position: 'relative', zIndex: 20 }} />
                </div>
            </div>

            {/* Text content */}
            <div style={textContainerStyle}>
                <h3 style={titleStyle}>
                    Network Error
                </h3>
                <p style={descriptionStyle}>
                    {message || "We can't reach the DLS engine. Please check your data connection or Wi-Fi and try again."}
                </p>
            </div>

            {/* Retry button */}
            <button
                onClick={onRetry}
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                <RefreshCcw style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Retry Connection</span>
            </button>

            {/* Offline badge */}
            <div style={badgeStyle}>
                <div style={dotStyle} />
                <span style={badgeTextStyle}>
                    Offline Mode Engaged
                </span>
            </div>

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
        </div>
    );
};
