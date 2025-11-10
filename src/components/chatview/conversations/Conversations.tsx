import { BsPencilSquare } from "react-icons/bs";
import ConversationList from "./ConversationList";
import '../../../styles/scrollbar.css';
import SearchBar from "../../common/SearchBar";
import { useEffect, useState } from "react";
import { IoSettings } from "react-icons/io5";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../common/Modal";
import { FaMoon, FaUserFriends } from "react-icons/fa";
import { useTheme } from "../../../utilities/ThemeContext";
import Sidebar from "./Sidebar";
import { useAuth } from "../../../utilities/AuthContext";
import Avatar from "../../common/Avatar";
import { UserResponse } from "../../../types/User";
import CreateNewChatModal from "./CreateNewChatModal";
import { searchConversations } from "../../../services/ConversationService";
import { ConversationResponse } from "../../../types/Conversation";
import ConversationAvatar from "./ConversationAvatar";
import { GoPlus } from "react-icons/go";
import useDeviceTypeByWidth from "../../../utilities/useDeviceTypeByWidth";
import { callLogout } from "../../../services/AuthService";
import { ROUTES } from "../../../utilities/Constants";

const Conversations = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const deviceType = useDeviceTypeByWidth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

    const [searchedConversations, setSearchedConversations] = useState<ConversationResponse[] | null>(null);

    const LOCAL_STORAGE_KEY = 'user_account';
    const [userAccount, setUser] = useState<UserResponse | null>(null);
    const navigate = useNavigate();

    const toggleSettingModalOpen = () => setIsSettingModalOpen(!isSettingModalOpen);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleConversationSearch = async (keyword: string) => {
        if (user?.user.id) {
            if (keyword.trim() === "") {
                setSearchedConversations(null);
                return;
            }
            try {
                const data = await searchConversations(keyword, user.user.id, 0);
                setSearchedConversations(data.result || []);
                console.log("searched convs" + data.result);
            } catch (error) {
                console.error("Error searching conversations:", error);
            }
        }
    };

    const handleClearSearch = () => {
        setSearchedConversations(null);
    };
    
    const handleLogout = async () => {
        try {
            await callLogout();
            logout();
            navigate("/login");
        } catch (error) {
            console.error("Lỗi khi logout:", error);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedUser && storedUser !== "undefined") {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className={`flex flex-row gap-2`}>
            {deviceType !== 'Mobile' && (
                <Sidebar />
            )}

            <div className={`overflow-hidden min-w-[88%] flex flex-col items-center pb-0 pe-1 rounded-xl shadow-sm
                ${deviceType == 'Mobile' ? 'p-4 ps-2' : 'p-2'}
                ${deviceType !== 'Mobile' ? 'max-h-[96dvh] min-h-[96dvh]' : 'h-[100dvh]'}
                ${isDarkMode ? 'bg-[#161618] text-gray-300' : 'bg-white text-black'}`}>

                <div className="flex flex-row items-center justify-between p-2 py-0 pe-4 self-start w-full">
                    <div className="relative flex flex-row gap-4 items-center justify-start w-[65%]">
                        <button className={`p-2 rounded-full text-xl
                            ${isDarkMode ? 'text-white bg-[#474747] hover:bg-[#5A5A5A]'
                                    : 'text-black bg-gray-100 hover:bg-gray-200'}`}
                            onClick={toggleMenu}>
                            {/* <Avatar avatarUrl={userAccount ? userAccount.avatarUrl : user?.user.avatarUrl || '/images/user_default.avif'} width={8} height={8}></Avatar> */}
                            <FiMenu />
                        </button>

                        {isMenuOpen && (
                            <div className={`absolute top-8 left-0 mt-2 w-64 border rounded-lg shadow-lg z-10
                                ${isDarkMode ? 'bg-[#2E2E2E] border-gray-900' : 'bg-white border-gray-200'}`}>
                                <ul className="text-gray-700 px-1">
                                    <Link to={`${deviceType == 'Mobile' 
                                        ? `${ROUTES.MOBILE.PROFILE(user?.user.id)}`
                                        : `${ROUTES.DESKTOP.PROFILE(user?.user.id)}`}`}>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-md font-bold cursor-pointer
                                            ${isDarkMode ? 'text-gray-300 hover:bg-[#545454]' : 'text-black hover:bg-gray-100'}`}
                                            onClick={() => setIsMenuOpen(false)}>
                                            <img src={user?.user.avatarUrl || '/images/user_default.avif'} className="w-8 h-8 rounded-full" />
                                            {user?.user.firstName + " " + user?.user.lastName}
                                        </li>
                                    </Link>
                                    <hr className={`border ${isDarkMode ? 'border-[#545454]' : 'border-gray-100'}`}></hr>
                                    <Link to={`${deviceType == 'Mobile'
                                        ? `${ROUTES.MOBILE.PROFILE_FRIENDS(user?.user.id)}`
                                        : `${ROUTES.DESKTOP.PROFILE_FRIENDS(user?.user.id)}`}`}>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-md font-bold cursor-pointer
                                            ${isDarkMode ? 'text-gray-300 hover:bg-[#545454]' : 'text-black hover:bg-gray-100'}`}
                                            onClick={() => setIsMenuOpen(false)}>
                                            <button className={`p-2 rounded-full text-xl
                                                ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#545454]'
                                                    : 'text-black bg-gray-200 hover:bg-gray-100'}`}>
                                                <FaUserFriends />
                                            </button>
                                            Bạn bè
                                        </li>
                                    </Link>
                                    <hr className={`border ${isDarkMode ? 'border-[#545454]' : 'border-gray-100'}`}></hr>
                                    <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-md font-bold cursor-pointer
                                        ${isDarkMode ? 'text-gray-300 hover:bg-[#545454]' : 'text-black hover:bg-gray-100'}`}
                                        onClick={() => {
                                            toggleSettingModalOpen();
                                            setIsMenuOpen(false);
                                        }}>
                                        <button className={`p-2 rounded-full text-xl
                                            ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#545454]'
                                                : 'text-black bg-gray-200 hover:bg-gray-100'}`}>
                                            <IoSettings />
                                        </button>
                                        Cài đặt
                                    </li>
                                    <hr className={`border ${isDarkMode ? 'border-[#545454]' : 'border-gray-100'}`}></hr>
                                    <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-md font-bold cursor-pointer
                                        ${isDarkMode ? 'text-gray-300 hover:bg-[#545454]' : 'text-black hover:bg-gray-100'}`}
                                        onClick={handleLogout}>
                                        <button className={`p-2 rounded-full text-xl
                                            ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#545454]'
                                                : 'text-black bg-gray-200 hover:bg-gray-100'}`}>
                                            <FiLogOut />
                                        </button>
                                        Đăng xuất
                                    </li>
                                </ul>
                            </div>
                        )}
                        <button onClick={() => setIsNewChatModalOpen(true)}
                            className={`p-0.5 rounded-full text-3xl
                            ${isDarkMode ? 'text-white bg-[#474747] hover:bg-[#5A5A5A]'
                                    : 'text-black bg-gray-100 hover:bg-gray-200'}`}>
                            <GoPlus />
                        </button>
                    </div>
                    <h2 className={`text-2xl font-bold bg-gradient-to-br from-blue-500 to-pink-400 bg-clip-text text-transparent`}> 
                        ChitChat 
                    </h2>
                </div>

                <div className="flex flex-col items-center w-full h-fit p-2 pe-4">
                    <SearchBar placeholder="Tìm kiếm hội thoại..." onSearch={handleConversationSearch} onClear={handleClearSearch}/>
                </div>

                {/* Danh sách hội thoại */}
                <div className="flex flex-col items-center w-full h-full py-1 pe-2 overflow-y-auto overflow-x-hidden">
                    {searchedConversations != null ? (
                        searchedConversations.length > 0 ? (
                            <ul className="w-full">
                                {searchedConversations.map((conv) => (
                                    <Link to={`${deviceType == 'Mobile' 
                                        ? `${ROUTES.MOBILE.CONVERSATION(conv.id)}`
                                        : `${ROUTES.DESKTOP.CONVERSATION(conv.id)}`}`} key={conv.id} 
                                        >
                                        <li className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
                                                ${isDarkMode ? 'hover:bg-[#3A3A3A]' : 'hover:bg-gray-100'}`}>
                                            <ConversationAvatar avatarUrls={conv.avatarUrls != undefined ? conv.avatarUrls : []}
                                                width={12} height={12}></ConversationAvatar>
                                            <span className={`text-md font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                                {conv.name}
                                            </span>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center">Không tìm thấy hội thoại nào.</p>
                        )
                    ) : (
                        <ConversationList />
                    )}
                </div>

                {/* Settings Modal */}
                <Modal isOpen={isSettingModalOpen} onClose={() => setIsSettingModalOpen(false)}>
                    <h2 className="text-lg font-bold mb-3">Tuỳ chỉnh</h2>
                    <div className="flex flex-col items-start justify-start gap-4 w-full">
                        <div className="flex items-center justify-start gap-2">
                            <div className={`rounded-full p-2 text-xl ${isDarkMode ? 'bg-[#474747]' : 'bg-gray-100'}`}>
                                <FaMoon />
                            </div>
                            <div className="flex flex-col items-start justify-start">
                                <p className="text-md font-semibold">Chế độ tối</p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Điều chỉnh giao diện của ChitChat để giảm độ chói và cho đôi mắt được nghỉ ngơi.
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col items-center gap-2 w-full'>
                            <label className={`flex gap-2 w-full rounded-lg p-2 ps-10 items-center justify-between 
                                ${isDarkMode ? 'hover:bg-[#474747]' : 'hover:bg-gray-200'} cursor-pointer`}
                                onClick={() => toggleDarkMode}>
                                <p>Đang tắt</p>
                                <div className={`flex items-center rounded-full p-2 cursor-pointer
                                    ${isDarkMode ? 'text-white hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-200'}`}>
                                    <input type="radio" name="darkmode" value="on" className="w-6 h-6 cursor-pointer"
                                        checked={isDarkMode === false}
                                        onChange={() => toggleDarkMode()} />
                                </div>
                            </label>
                            <label className={`flex gap-2 w-full rounded-lg p-2 ps-10 items-center justify-between 
                                ${isDarkMode ? 'hover:bg-[#474747]' : 'hover:bg-gray-200'} cursor-pointer`}
                                onClick={() => toggleDarkMode}>
                                <p>Đang bật</p>
                                <div className={`flex items-center rounded-full p-2 cursor-pointer
                                    ${isDarkMode ? 'text-white hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-200'} `}>
                                    <input type="radio" name="darkmode" value="off" className="w-6 h-6 cursor-pointer"
                                        checked={isDarkMode === true}
                                        onChange={() => toggleDarkMode()} />
                                </div>
                            </label>
                        </div>
                    </div>
                </Modal>

                <CreateNewChatModal isOpen={isNewChatModalOpen} onClose={() => setIsNewChatModalOpen(false)} />
            </div>
        </div>
    );
}

export default Conversations;

