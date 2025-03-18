import { PiDotsThreeOutline } from "react-icons/pi";
import { FriendCardProps } from "./FriendCard";
import { FaUserCheck } from "react-icons/fa";
import useDeviceTypeByWidth from "../../../utilities/useDeviceTypeByWidth";
import { FaCircleCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useTheme } from "../../../utilities/ThemeContext";



const FriendRequestCard: React.FC<FriendCardProps> = ({ friend, isOpen, toggleFriendMenuOpen }) => {
	const deviceType = useDeviceTypeByWidth();
    const { isDarkMode  } = useTheme();
    // const { user } = useAuth();
    // const { acceptFriendRequest, rejectFriendRequest } = useFriendRequest();

    // const handleAccept = async () => {
    //     await acceptFriendRequest(friendRequest.id);
    // };

    // const handleReject = async () => {
    //     await rejectFriendRequest(friendRequest.id);
    // };

    return (
        <div className={` flex items-center justify-between gap-4 p-2 border border-gray-100 rounded-lg shadow-sm
            ${deviceType == 'PC' ? '' : 'w-full'}
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
            <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit border-2 
                    rounded-full shadow-md transition duration-200
                    ${isDarkMode 
                    ? 'border-blue-400 text-gray-200 bg-[#1F1F1F] hover:text-blue-300' 
                    : 'border-blue-400 text-blue-700 bg-white hover:bg-gradient-to-r from-blue-500 to-blue-400 hover:text-white '}
                    `}>
                    {deviceType == 'PC' ? 
                        (
                            <div className="flex items-center gap-2">
                                <FaUserCheck />
                                <p className="text-sm font-semibold">Đồng ý</p>
                            </div>
                        )
                    : <FaCircleCheck />}
                </button>
                <button className={`rounded-full border-2 py-2 px-3 text-center text-sm font-semibold 
                    ${isDarkMode 
                    ? 'border-gray-400 text-gray-300 bg-[#1F1F1F] hover:text-gray-200 hover:bg-[#5A5A5A]' 
                    : 'bg-white text-black border-gray-600  hover:text-white hover:bg-gray-600 '}
                    `}>
                    {deviceType == 'PC' ? (<div>Xoá</div>) : <IoClose />}
                </button>
                <button className={`rounded-full p-2 text-center text-2xl font-semibold border
                    ${isOpen ? 'bg-[#474747]' : ''}
                    ${isDarkMode ? 'text-white  hover:bg-[#5A5A5A]' 
                            : 'text-black bg-gray-100 hover:bg-gray-200'}`}
                    onClick={toggleFriendMenuOpen}>
                    <PiDotsThreeOutline />
                </button>
            </div>
        </div>
    );
};

export default FriendRequestCard;


