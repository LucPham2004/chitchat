import { PiDotsThreeOutline } from "react-icons/pi";
import { FriendCardProps } from "./FriendCard";
import { FaUserPlus } from "react-icons/fa";
import useDeviceTypeByWidth from "../../../utilities/useDeviceTypeByWidth";
import { useTheme } from "../../../utilities/ThemeContext";
import { useState } from "react";
import { sendFriendRequest, deleteFriendship } from "../../../services/FriendshipService";
import { useAuth } from "../../../utilities/AuthContext";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";



const UserCard: React.FC<FriendCardProps> = ({ friend, isOpen, toggleFriendMenuOpen }) => {
    const deviceType = useDeviceTypeByWidth();
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    // const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isRequetSent, setIsRequetSent] = useState(false);


    const handleSendRequest = async () => {
        try {
            console.log("clicked")
            if (!user) return;
            const res = await sendFriendRequest(user?.user.id, friend.id);
            setIsRequetSent(true);
            console.log("Yêu cầu kết bạn đã được gửi: ", res);
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu kết bạn: ", error);
        }
    };
    
    const handleReject = async () => {
        try {
            if (user?.user.id) {
                await deleteFriendship(user?.user.id, friend.id);
            }
            console.log("Đã xoá kết bạn.");
        } catch (error) {
            console.error("Lỗi khi xoá kết bạn: ", error);
        }
    };

    return (
        <div className={` flex items-center justify-between gap-4 p-2 border border-gray-100 rounded-lg shadow-sm
            ${deviceType == 'PC' ? '' : 'w-full'}
            ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}
        `}>
            <div className="flex items-center gap-4">
                <Link to={`${deviceType == 'Mobile' 
                        ? `/mobile/profile/${friend.id}`
                        : `/d/profile/${friend.id}`}`} >
                <img 
                    src={friend.avatarUrl ? friend.avatarUrl : '/user_default.avif'} 
                    alt={friend.firstName} 
                    className="w-24 h-24 rounded-lg object-cover" />
                </Link>
                <div className={`flex flex-col items-start  ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Link to={`${deviceType == 'Mobile' 
                        ? `/mobile/profile/${friend.id}`
                        : `/d/profile/${friend.id}`}`} className="text-xl cursor-pointer">{friend.firstName + " " + `${friend.lastName ? friend.lastName : ''}`}</Link>
                    <p className="text-sm font-semibold">{friend.mutualFriendsNum} bạn chung</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                {isRequetSent ? (
                <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit border-2 
                    rounded-full shadow-md transition duration-200
                    ${isDarkMode
                        ? 'border-blue-400 text-gray-200 bg-[#161618] hover:text-blue-300'
                        : 'border-blue-400 text-blue-700 bg-white hover:bg-gradient-to-r from-blue-500 to-blue-400 hover:text-white '}
                    `}
                    onClick={handleReject}>
                    <IoClose />
                    <p className="text-sm font-semibold">Huỷ lời mời</p>
                </button>
                ) : (
                <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit border-2 
                    rounded-full shadow-md transition duration-200
                    ${isDarkMode
                        ? 'border-blue-400 text-gray-200 bg-[#161618] hover:text-blue-300'
                        : 'border-blue-400 text-blue-700 bg-white hover:bg-gradient-to-r from-blue-500 to-blue-400 hover:text-white '}
                    `}
                    onClick={handleSendRequest}>
                    <FaUserPlus />
                    <p className="text-sm font-semibold">Kết bạn</p>
                </button>)}

                <button className={`rounded-full p-2 text-center text-2xl font-semibold border
                    ${isOpen ? 'bg-[#474747]' : ''}
                    ${isDarkMode ? 'text-white hover:bg-[#5A5A5A]'
                        : 'text-black bg-gray-100 hover:bg-gray-200'}`}
                    onClick={toggleFriendMenuOpen}>
                    <PiDotsThreeOutline />
                </button>
            </div>


            {/* {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className={`p-6 rounded-lg shadow-lg w-96 
                            ${isDarkMode ? 'bg-[#2C2C2C] text-white' : 'bg-white text-black'}`}>
                        <h2 className="text-lg font-semibold mb-4">Xác nhận yêu cầu kết bạn</h2>
                        <p className="mb-6">Bạn có chắc muốn đồng ý kết bạn với <strong>{friend.firstName} {friend.lastName}</strong>?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="px-4 py-2 rounded-full bg-gray-400 hover:bg-gray-500 text-white">
                                Hủy
                            </button>
                            <button
                                onClick={async () => {
                                    await handleSendRequest();
                                    setIsConfirmModalOpen(false);
                                }}
                                className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default UserCard;


