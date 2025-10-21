import { ReactNode } from "react";
import { useTheme } from "../../utilities/ThemeContext";

interface SocialLinkButtonProps {
    icon: ReactNode;
    textColor?: string;
    borderColor?: string;
    bgColorFrom?: string;
    bgColorTo?: string;
}

const SocialLinkButton: React.FC<SocialLinkButtonProps> = ({
    icon, textColor, borderColor, bgColorFrom, bgColorTo
}) => {
    
    const { isDarkMode } = useTheme();
    return (
        <div className="w-[60px] flex items-center justify-center">
            <button
                className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                border-2 rounded-full shadow-md transition duration-100
                ${isDarkMode ? 'bg-[#161618]' : 'bg-white'}
                text-${textColor} border-${borderColor} 
                hover:bg-gradient-to-r from-${bgColorFrom} to-${bgColorTo} hover:text-white`}
            >
                {icon}
            </button>
        </div>
    );
};

export default SocialLinkButton;
