import { PiDotsThreeBold } from "react-icons/pi";
import { useTheme } from "../../../../utilities/ThemeContext";

export interface Participant {
    id: string;
    avatar: string;
    name: string;
    toggleUserMenu?: () => void;
}

const ParticipantCard: React.FC<Participant> = ({ id, avatar, name, toggleUserMenu }) => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    
    return (
        <div className="flex flex-row justify-between p-2">
            <div className="flex items-center gap-2">
                <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover"/>
                <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>
                    <h3>{name}</h3>
                </div>
            </div>

            <button className={`self-end rounded-full p-1 text-center text-3xl font-semibold
                ${isDarkMode ? 'hover:bg-[#5A5A5A] text-gray-200' : 'hover:bg-gray-200 text-black'}`}
                onClick={toggleUserMenu}>
                <PiDotsThreeBold />
            </button>
        </div>
    );
}

export default ParticipantCard;

