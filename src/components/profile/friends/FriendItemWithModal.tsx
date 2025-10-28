import { Link, useNavigate, useParams } from "react-router-dom";
import { IoChatbubblesSharp } from "react-icons/io5";
import { ImBlocked } from "react-icons/im";
import { UserDTO } from "../../../types/User";
import useDeviceTypeByWidth from "../../../utilities/useDeviceTypeByWidth";
import { useAuth } from "../../../utilities/AuthContext";
import { getDirectMessage } from "../../../services/ConversationService";

interface FriendItemProps {
    friend: UserDTO;
    index: number;
    isOpen: boolean;
    toggleMenu: () => void;
    isDarkMode: boolean;
    CardComponent: React.ComponentType<{ friend: UserDTO; isOpen: boolean; toggleFriendMenuOpen?: () => void; }>;
}

const FriendItemWithModal: React.FC<FriendItemProps> = ({
    friend,
    index,
    isOpen,
    toggleMenu,
    isDarkMode,
    CardComponent
}) => {
    const { user } = useAuth();
	const deviceType = useDeviceTypeByWidth();
    const navigate = useNavigate();

    const menuPosition = index + 5 > 10 ? "-top-24" : "top-16";
    const baseClass = isDarkMode ? "text-white bg-[#2E2E2E]" : "text-black bg-white";
    const hoverClass = isDarkMode ? "text-gray-200 hover:bg-[#5A5A5A]" : "text-black hover:bg-gray-100";
    const btnClass = isDarkMode ? "bg-[#474747] text-gray-200 border-gray-900" : "bg-white border-gray-200";

    const handleUserSearch = async () => {
        if (user?.user.id) {
            try {
                const data = await getDirectMessage(user?.user.id, friend.id);
                if (data?.code == 1000 && data.result) {
                    if(deviceType == 'Mobile') {
                        navigate(`/mobile/conversations/${data.result.id}`);
                    } else {
                        navigate(`/conversations/${data.result.id}`);
                    }
                }
            } catch (error) {
                console.error("Error searching conversations:", error);
            }
        }
    };

    return (
        <div className="relative w-full max-w-[500px]" key={friend.id}>
            <CardComponent
                friend={friend}
                isOpen={isOpen}
                toggleFriendMenuOpen={toggleMenu}
            />
            {isOpen && (
                <div className={`absolute right-10 ${menuPosition} mt-2 w-64 border rounded-lg shadow-lg z-10 ${baseClass}`}>
                    <ul className="text-gray-700 p-1">
                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold cursor-pointer ${hoverClass}`}
                            onClick={handleUserSearch}>
                            <button className={`p-2 rounded-full text-black text-xl ${btnClass}`}>
                                <IoChatbubblesSharp />
                            </button>
                            Nhắn tin
                        </li>
                        <hr />
                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold cursor-pointer ${hoverClass}`}>
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
