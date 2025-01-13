import { PiDotsThreeOutline } from "react-icons/pi";
import { IoChatbubblesSharp } from "react-icons/io5";
import { UserDTO } from "../../types/User";
import useDeviceTypeByWidth from "../../utilities/useDeviceTypeByWidth";
import { useTheme } from "../../utilities/ThemeContext";

export interface FriendCardProps {
    friend: UserDTO;
    isOpen: boolean;
    toggleFriendMenuOpen?: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, isOpen, toggleFriendMenuOpen }) => {
	const deviceType = useDeviceTypeByWidth();
    const { isDarkMode  } = useTheme();
    
    return (
        <div className={` flex items-center justify-between gap-4 p-2 border rounded-lg shadow-sm
            ${deviceType == 'PC' ? 'min-w-[520px] max-w-[520px]' : 'w-full'}
            ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}
        `}>
            <div className="flex items-center gap-4">
                <img src={friend.avatarUrl} alt={friend.firstName + " " + friend.lastName} className="w-24 h-24 rounded-lg object-cover" />
                <div className={`flex flex-col items-start  ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <h3 className="text-lg">{friend.firstName + " " + friend.lastName}</h3>
                    <p className="text-sm font-semibold">{friend.mutualFriendsNum} bạn chung</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                {deviceType == 'PC' &&
                <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit border-2 
                    rounded-full shadow-md transition duration-200
                    ${isDarkMode 
                    ? 'border-blue-400 text-gray-200 bg-[#1F1F1F] hover:text-blue-300' 
                    : 'border-blue-400 text-blue-700 bg-white hover:bg-gradient-to-r from-blue-500 to-blue-400 hover:text-white '}
                    `}>
                    <IoChatbubblesSharp />
                    <p className="text-sm font-semibold">Nhắn tin</p>
                </button>
                }
                <button className={`rounded-full p-2 text-center text-2xl font-semibold 
                    ${isOpen ? 'bg-gray-400' : ''}
                    ${isDarkMode ? 'text-white bg-[#474747] hover:bg-[#5A5A5A]' 
                            : 'text-black bg-gray-100 hover:bg-gray-200'}`}
                    onClick={toggleFriendMenuOpen}>
                    <PiDotsThreeOutline />
                </button>
            </div>
        </div>
    );
}

export default FriendCard;


