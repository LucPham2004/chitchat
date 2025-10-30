import { PiDotsThreeOutline } from "react-icons/pi";
import { IoChatbubblesSharp } from "react-icons/io5";
import { UserDTO } from "../../../types/User";
import useDeviceTypeByWidth from "../../../utilities/useDeviceTypeByWidth";
import { useTheme } from "../../../utilities/ThemeContext";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../utilities/Constants";

export interface FriendCardProps {
    friend: UserDTO;
    isOpen: boolean;
    toggleFriendMenuOpen?: () => void;
    showToast?: (content: string, status: string) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, isOpen, toggleFriendMenuOpen }) => {
	const deviceType = useDeviceTypeByWidth();
    const { isDarkMode  } = useTheme();
    
    return (
        <div className={` flex items-center justify-between gap-4 p-2 border rounded-lg shadow-sm
            ${deviceType == 'PC' ? '' : 'w-full'}
            ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}
        `}>
            <div className="flex items-center gap-4">
                <Link to={`${deviceType == 'Mobile' 
                        ? `${ROUTES.MOBILE.PROFILE(friend.id)}`
                        : `${ROUTES.DESKTOP.PROFILE(friend.id)}`}`} >
                <img 
                    src={friend.avatarUrl ? friend.avatarUrl : '/user_default.avif'} 
                    alt={friend.firstName + " " + friend.lastName} 
                    className="w-24 h-24 rounded-lg object-cover" />
                </Link>
                <div className={`flex flex-col items-start  ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Link to={`${deviceType == 'Mobile' 
                        ? `${ROUTES.MOBILE.PROFILE(friend.id)}`
                        : `${ROUTES.DESKTOP.PROFILE(friend.id)}`}`} 
                        className="text-xl cursor-pointer">{friend.firstName + " " + friend.lastName}</Link>
                    <p className="text-sm font-semibold">{friend.mutualFriendsNum} bạn chung</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                {deviceType == 'PC' &&
                <Link to={`${ROUTES.DESKTOP.CONVERSATION(friend.conversationId)}`}>
                <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit border-2 
                    rounded-full shadow-md transition duration-200
                    ${isDarkMode 
                    ? 'border-blue-400 text-gray-200 bg-[#161618] hover:text-blue-300' 
                    : 'border-blue-400 text-blue-700 bg-white hover:bg-gradient-to-r from-blue-500 to-blue-400 hover:text-white '}
                    `}>
                    <IoChatbubblesSharp />
                    <p className="text-sm font-semibold">Nhắn tin</p>
                </button>
                </Link>
                }
                <button className={`rounded-full p-2 text-center text-2xl font-semibold border
                    ${isOpen ? 'bg-[#474747]' : ''}
                    ${isDarkMode ? 'text-white hover:bg-[#5A5A5A]' 
                            : 'text-black bg-gray-100 hover:bg-gray-200'}`}
                    onClick={toggleFriendMenuOpen}>
                    <PiDotsThreeOutline />
                </button>
            </div>
        </div>
    );
}

export default FriendCard;


