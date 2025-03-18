import { Link } from "react-router-dom";
import { IoChatbubblesSharp } from "react-icons/io5";
import { ImBlocked } from "react-icons/im";
import { UserDTO } from "../../../types/User";

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
    const menuPosition = index + 5 > 10 ? "-top-40" : "top-16";
    const baseClass = isDarkMode ? "text-white bg-[#2E2E2E]" : "text-black bg-white";
    const hoverClass = isDarkMode ? "text-gray-200 hover:bg-[#5A5A5A]" : "text-black hover:bg-gray-100";
    const btnClass = isDarkMode ? "bg-[#474747] text-gray-200 border-gray-900" : "bg-white border-gray-200";

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
                        <Link to="/profile">
                            <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold cursor-pointer ${hoverClass}`}>
                                <img src={friend.avatarUrl} className="w-8 h-8 rounded-full" />
                                Xem trang cá nhân
                            </li>
                        </Link>
                        <hr />
                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold cursor-pointer ${hoverClass}`}>
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
