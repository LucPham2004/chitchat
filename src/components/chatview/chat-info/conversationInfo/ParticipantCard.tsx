import { PiDotsThreeBold } from "react-icons/pi";
import { useTheme } from "../../../../utilities/ThemeContext";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IoChatbubblesSharp } from "react-icons/io5";
import { ROUTES } from "../../../../utilities/Constants";

export interface Participant {
    id: string;
    avatar: string;
    name: string;
    toggleUserMenu: (id: string) => void;
    selectedParticipantId: string | null;
}

const ParticipantCard: React.FC<Participant> = ({ id, avatar, name, toggleUserMenu, selectedParticipantId }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className="relative flex flex-row justify-between p-2">
            <div className="flex items-center gap-2">
                <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>
                    <a href={`${ROUTES.DESKTOP.PROFILE(id)}`}>{name}</a>
                </div>
            </div>

            <button className={`self-end rounded-full p-1 text-center text-3xl font-semibold
                ${isDarkMode ? 'hover:bg-[#5A5A5A] text-gray-200' : 'hover:bg-gray-200 text-black'}`}
                onClick={() => toggleUserMenu(id)}>
                <PiDotsThreeBold />
            </button>

            {selectedParticipantId === id && (
                <div className="absolute top-8 right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
                    <ul className="text-gray-700 p-1">
                        <Link to={`${ROUTES.DESKTOP.PROFILE(id)}`}>
                            <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold hover:bg-gray-100 cursor-pointer">
                                <img src={avatar} className="w-8 h-8 rounded-full" />
                                Xem trang cá nhân
                            </li>
                        </Link>
                        <hr></hr>
                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold hover:bg-gray-100 cursor-pointer">
                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-200">
                                <IoChatbubblesSharp />
                            </button>
                            Nhắn tin
                        </li>
                        <hr></hr>
                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold hover:bg-gray-100 cursor-pointer">
                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-200">
                                <FiLogOut />
                            </button>
                            Chặn
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ParticipantCard;

