import { Link, useNavigate, useParams } from "react-router-dom";
import { IoChatbubblesSharp } from "react-icons/io5";
import { ImBlocked } from "react-icons/im";
import { UserDTO } from "../../../types/User";
import useDeviceTypeByWidth from "../../../utilities/DeviceType";
import { useAuth } from "../../../utilities/AuthContext";
import { getDirectMessage } from "../../../services/ConversationService";
import { ROUTES } from "../../../utilities/Constants";
import { blockUser, deleteFriendship } from "../../../services/FriendshipService";

interface FriendItemProps {
    friend: UserDTO;
    index: number;
    isOpen: boolean;
    toggleMenu: () => void;
    isDarkMode: boolean;
    CardComponent: React.ComponentType<{
        friend: UserDTO;
        isOpen: boolean;
        toggleFriendMenuOpen?: () => void;
        showToast?: (content: string, status: string) => void;
    }>;
    showToast: (content: string, status: string) => void;
}

const FriendItemWithModal: React.FC<FriendItemProps> = ({
    friend,
    index,
    isOpen,
    toggleMenu,
    isDarkMode,
    CardComponent,
    showToast
}) => {
    const { user } = useAuth();
    const deviceType = useDeviceTypeByWidth();
    const navigate = useNavigate();

    const menuPosition = index + 5 > 10 ? "-top-24" : "top-16";
    const baseClass = isDarkMode ? "text-white bg-[#2E2E2E] border-gray-500" : "text-black bg-white border-gray-300";
    const hoverClass = isDarkMode ? "text-gray-200 hover:bg-[#5A5A5A]" : "text-black hover:bg-gray-100";
    const btnClass = isDarkMode ? "bg-[#474747] text-gray-200 border-gray-900" : "bg-white border-gray-200";

    const handleGetDirectMessage = async () => {
        if (user?.user.id) {
            try {
                const data = await getDirectMessage(user?.user.id, friend.id);
                if (data?.code == 1000 && data.result) {
                    if (deviceType == 'Mobile') {
                        navigate(`${ROUTES.MOBILE.CONVERSATION(data.result.id)}`);
                    } else {
                        navigate(`${ROUTES.DESKTOP.CONVERSATION(data.result.id)}`);
                    }
                }
            } catch (error) {
                console.error("Error searching conversations:", error);
            }
        }
    };
    
    const handleReject = async () => {
        try {
            if (user?.user.id) {
                await deleteFriendship(user?.user.id, friend.id);

                console.log("Đã xoá lời mời kết bạn!");
            }
            return (<></>)
        } catch (error) {
            console.error("Lỗi khi xoá lời mời kết bạn: ", error);
        }
    };

    const handleBlockUser = async () => {
        if (!user) return;

        const isConfirm = window.confirm(
            `Bạn có chắc muốn chặn ${friend.fullName || "người này"} không?`
        );

        if (!isConfirm) return;

        try {
            const data = await blockUser(user.user.id, friend.id);
            if (data?.code == 1000) {
                console.log("User blocked:", data.result);
                await handleReject();
                showToast("Chặn người dùng thành công", "success");
            }
        } catch (error) {
            console.error("Error blocking user:", error);
            showToast("Đã có lỗi xảy ra khi chặn người dùng", "error");
        }
    };

    return (
        <div className="relative w-full max-w-[500px]" key={friend.id}>
            <CardComponent
                friend={friend}
                isOpen={isOpen}
                toggleFriendMenuOpen={toggleMenu}
                showToast={showToast}
            />
            {isOpen && (
                <div className={`absolute right-10 ${menuPosition} mt-2 w-64 border rounded-lg shadow-lg z-10 ${baseClass}`}>
                    <ul className="text-gray-700 p-1">
                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold cursor-pointer ${hoverClass}`}
                            onClick={handleGetDirectMessage}>
                            <button className={`p-2 rounded-full text-black text-xl ${btnClass}`}>
                                <IoChatbubblesSharp />
                            </button>
                            Nhắn tin
                        </li>
                        <hr />
                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold cursor-pointer ${hoverClass}`}
                            onClick={handleBlockUser}>
                            <button className={`p-2 rounded-full text-black text-xl ${btnClass}`}>
                                <ImBlocked />
                            </button>
                            Chặn
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FriendItemWithModal;
