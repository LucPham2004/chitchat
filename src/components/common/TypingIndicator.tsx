import React from "react";
import { useTheme } from "../../utilities/ThemeContext";

interface TypingIndicatorProps {
    userName?: string;
    show: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ userName = "User", show }) => {
    const { isDarkMode } = useTheme();

    if (!show) return null;

    return (
        <div className={`inline-flex items-center gap-3 py-1 px-5 rounded-full w-fit transition-all duration-300 shadow-lg
            ${isDarkMode 
                ? 'bg-gradient-to-r from-[#161618e2] to-[#161618e0] shadow-gray-900/30' 
                : 'bg-gradient-to-r from-[#ffffffa0] to-[#ffffffdd] shadow-gray-300/40'}`}>

            {/* Text and dots container */}
            <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className={`${isDarkMode ? 'text-cyan-400' : 'text-orange-500'}`}>{userName}</span> đang soạn tin
                </span>
                
                {/* Animated dots */}
                <div className="flex gap-1 items-center">
                    <span className={`w-2 h-2 rounded-full animate-pulse
                        ${isDarkMode ? 'bg-cyan-300' : 'bg-green-500'}`}
                        style={{ 
                            animationDuration: '1.4s',
                            animationDelay: '0s' 
                        }}></span>
                    <span className={`w-2 h-2 rounded-full animate-pulse
                        ${isDarkMode ? 'bg-purple-300' : 'bg-cyan-500'}`}
                        style={{ 
                            animationDuration: '1.4s',
                            animationDelay: '0.2s' 
                        }}></span>
                    <span className={`w-2 h-2 rounded-full animate-pulse
                        ${isDarkMode ? 'bg-pink-300' : 'bg-pink-500'}`}
                        style={{ 
                            animationDuration: '1.4s',
                            animationDelay: '0.4s' 
                        }}></span>
                </div>
            </div>

            {/* Subtle glow effect */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-20 -z-10
                ${isDarkMode ? 'bg-blue-500' : 'bg-purple-400'}`}></div>
        </div>
    );
};

export default TypingIndicator;
