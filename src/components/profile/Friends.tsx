import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { friendsData } from "../../FakeData";
import FriendCard from "./FriendCard";
import SearchBar from "../common/SearchBar";
import { ImBlocked } from "react-icons/im";
import { IoChatbubblesSharp } from "react-icons/io5";
import { useState } from "react";
import FriendRequestCard from "./FriendRequestCard";
import UserCard from "./UserCard";
import { useTheme } from "../../utilities/ThemeContext";



const Friends = () => {
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('allFriends');
    const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);

    const toggleFriendMenuOpen = (id: number) => {
        setSelectedFriendId(prevId => (prevId === id ? null : id));
    };
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const otherUser = false;

    const friends = friendsData;

    return (
        <div className={`min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex flex-col
            pb-0 rounded-xl bordershadow-sm overflow-y-auto
            ${isDarkMode ? 'bg-[#1F1F1F] text-gray-300 border-gray-900' : 'bg-white text-black border-gray-200'}`}>

            <div className={`sticky top-0 z-10 w-full flex px-4 pt-2
                    items-center justify-center border-b-2
                    ${isDarkMode ? 'bg-[#1F1F1F] text-gray-300 border-gray-900' : 'bg-white text-black border-gray-200'}`}>
                <div className="absolute top-3 left-4 z-10">
                    <button className={`p-2 rounded-full text-xl
                    ${isDarkMode ? 'text-gray-200 bg-[#474747] hover:bg-[#5A5A5A]' 
                        : 'text-black bg-gray-200 hover:bg-gray-100'}`}
                        onClick={goBack}>
                        <FaArrowLeft />
                    </button>
                </div>

                {!otherUser ? (
                    <div className="flex flex-row items-center justify-center rounded-md ms-[40px]">
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                            ${activeTab === 'allFriends' ? 
                                isDarkMode ? 'text-gray-100 border-blue-600' :'border-blue-600'
                                : isDarkMode ? 'text-gray-400 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-200'}`}
                            onClick={() => {
                                setActiveTab('allFriends');
                                setSelectedFriendId(null);
                            }}>
                            Tất cả bạn bè
                        </button>
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                            ${activeTab === 'friendRequests' ? 
                                isDarkMode ? 'text-gray-100 border-blue-600' :'border-blue-600'
                                : isDarkMode ? 'text-gray-400 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-200'}`}
                            onClick={() => {
                                setActiveTab('friendRequests');
                                setSelectedFriendId(null);
                            }}>
                            Lời mời kết bạn
                        </button>
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                            ${activeTab === 'findFriends' ? 
                                isDarkMode ? 'text-gray-100 border-blue-600' :'border-blue-600'
                                : isDarkMode ? 'text-gray-400 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-200'}`}
                            onClick={() => {
                                setActiveTab('findFriends');
                                setSelectedFriendId(null);
                            }}>
                            Tìm bạn bè
                        </button>
                    </div>
                ) : (
                    <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                            ${activeTab === 'findFriends' ? 
                                isDarkMode ? 'text-gray-100 border-blue-600' :'border-blue-600'
                                : isDarkMode ? 'text-gray-400 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('mutualFriends')}>
                        Bạn chung
                    </button>
                )}

                {/* <div className="w-[300px] absolute top-3 right-4">
                    <SearchBar />
                </div> */}
            </div>
            <div className="min-h-[86vh] max-h-[90vh] overflow-y-auto">
                <div className="w-full flex items-center justify-center gap-4 flex-wrap p-4">
                    <div className="w-full">
                        <div className="flex justify-end">
                            <SearchBar />
                        </div>
                    </div>

                    {/* All friends */}
                    {activeTab == 'allFriends' && friends.map((friend, index) => (
                        <div className="relative w-full max-w-[520px]" key={friend.id}>
                            <FriendCard key={friend.id} friend={friend}
                                isOpen={selectedFriendId === friend.id}
                                toggleFriendMenuOpen={() => toggleFriendMenuOpen(friend.id)} />
                            {selectedFriendId === friend.id && (
                                <div className={`absolute right-10 ${index + 5 > friends.length ? '-top-40 ' : 'top-16'} 
                                    mt-2 w-64 border rounded-lg shadow-lg z-10
                                    ${isDarkMode ? 'text-white bg-[#2E2E2E]' : 'text-black bg-white'}`}>
                                    <ul className="text-gray-700 p-1">
                                        <Link to={"/profile"}>
                                            <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                                font-bold cursor-pointer
                                                ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                                <img src={friend.avatarUrl} className="w-8 h-8 rounded-full" />
                                                Xem trang cá nhân
                                            </li>
                                        </Link>
                                        <hr></hr>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold 
                                            cursor-pointer
                                            ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                            <button className={`p-2 rounded-full text-black text-xl
                                                ${isDarkMode ? 'bg-[#474747] text-gray-200 border-gray-900' : 'bg-white border-gray-200'}`}>
                                                <IoChatbubblesSharp />
                                            </button>
                                            Nhắn tin
                                        </li>
                                        <hr></hr>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg
                                            font-bold cursor-pointer
                                            ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                            <button className={`p-2 rounded-full text-black text-xl
                                                ${isDarkMode ? 'bg-[#474747] text-gray-200 border-gray-900' : 'bg-white border-gray-200'}`}>
                                                <ImBlocked />
                                            </button>
                                            Chặn
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Friend requests */}
                    {activeTab == 'friendRequests' && friends.map((friend, index) => (
                        <div className="relative w-full max-w-[520px]" key={friend.id}>
                            <FriendRequestCard key={friend.id} friend={friend}
                                isOpen={selectedFriendId === friend.id}
                                toggleFriendMenuOpen={() => toggleFriendMenuOpen(friend.id)} />
                            {selectedFriendId === friend.id && (
                                <div className={`absolute right-10 ${index + 5 > friends.length ? '-top-40 ' : 'top-16'} 
                                    mt-2 w-64 border rounded-lg shadow-lg z-10
                                    ${isDarkMode ? 'text-white bg-[#2E2E2E]' : 'text-black bg-white'}`}>
                                    <ul className="text-gray-700 p-1">
                                        <Link to={"/profile"}>
                                            <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                                font-bold cursor-pointer
                                                ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                                <img src={friend.avatarUrl} className="w-8 h-8 rounded-full" />
                                                Xem trang cá nhân
                                            </li>
                                        </Link>
                                        <hr></hr>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold 
                                            cursor-pointer
                                            ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                            <button className={`p-2 rounded-full text-black text-xl
                                                ${isDarkMode ? 'bg-[#474747] text-gray-200 border-gray-900' : 'bg-white border-gray-200'}`}>
                                                <IoChatbubblesSharp />
                                            </button>
                                            Nhắn tin
                                        </li>
                                        <hr></hr>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                            font-bold cursor-pointer
                                            ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                            <button className={`p-2 rounded-full text-black text-xl
                                                ${isDarkMode ? 'bg-[#474747] text-gray-200 border-gray-900' : 'bg-white border-gray-200'}`}>
                                                <ImBlocked />
                                            </button>
                                            Chặn
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Find friends */}
                    {activeTab == 'findFriends' && friends.map((friend, index) => (
                        <div className="relative w-full max-w-[520px]" key={friend.id}>
                            <UserCard key={friend.id} friend={friend}
                                isOpen={selectedFriendId === friend.id}
                                toggleFriendMenuOpen={() => toggleFriendMenuOpen(friend.id)} />
                            {selectedFriendId === friend.id && (
                                <div className={`absolute right-10 ${index + 5 > friends.length ? '-top-40 ' : 'top-16'} 
                                    mt-2 w-64 border rounded-lg shadow-lg z-10
                                    ${isDarkMode ? 'text-white bg-[#2E2E2E]' : 'text-black bg-white'}`}>
                                    <ul className="text-gray-700 p-1">
                                        <Link to={"/profile"}>
                                            <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                                font-bold cursor-pointer
                                                ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                                <img src={friend.avatarUrl} className="w-8 h-8 rounded-full" />
                                                Xem trang cá nhân
                                            </li>
                                        </Link>
                                        <hr></hr>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold 
                                            cursor-pointer
                                            ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                            <button className={`p-2 rounded-full text-black text-xl
                                                ${isDarkMode ? 'bg-[#474747] text-gray-200 border-gray-900' : 'bg-white border-gray-200'}`}>
                                                <IoChatbubblesSharp />
                                            </button>
                                            Nhắn tin
                                        </li>
                                        <hr></hr>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                            font-bold cursor-pointer
                                            ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                            <button className={`p-2 rounded-full text-black text-xl
                                                ${isDarkMode ? 'bg-[#474747] text-gray-200 border-gray-900' : 'bg-white border-gray-200'}`}>
                                                <ImBlocked />
                                            </button>
                                            Chặn
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Mutual friends */}
                    {activeTab == 'mutualFriends' && friends.map((friend, index) => (
                        <div className="relative w-full max-w-[520px]" key={friend.id}>
                            <FriendCard key={friend.id} friend={friend}
                                isOpen={selectedFriendId === friend.id}
                                toggleFriendMenuOpen={() => toggleFriendMenuOpen(friend.id)} />
                            {selectedFriendId === friend.id && (
                                <div className={`absolute right-10 ${index + 5 > friends.length ? '-top-40 ' : 'top-16'} 
                                    mt-2 w-64 border rounded-lg shadow-lg z-10
                                    ${isDarkMode ? 'text-white bg-[#2E2E2E]' : 'text-black bg-white'}`}>
                                    <ul className="text-gray-700 p-1">
                                        <Link to={"/profile"}>
                                            <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                                font-bold cursor-pointer
                                                ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                                <img src={friend.avatarUrl} className="w-8 h-8 rounded-full" />
                                                Xem trang cá nhân
                                            </li>
                                        </Link>
                                        <hr></hr>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold 
                                            cursor-pointer
                                            ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                            <button className={`p-2 rounded-full text-black text-xl
                                                ${isDarkMode ? 'bg-[#474747] text-gray-200 border-gray-900' : 'bg-white border-gray-200'}`}>
                                                <IoChatbubblesSharp />
                                            </button>
                                            Nhắn tin
                                        </li>
                                        <hr></hr>
                                        <li className={`flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                            font-bold cursor-pointer
                                            ${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-100'}`}>
                                            <button className={`p-2 rounded-full text-black text-xl
                                                ${isDarkMode ? 'bg-[#474747] text-gray-200 border-gray-900' : 'bg-white border-gray-200'}`}>
                                                <ImBlocked />
                                            </button>
                                            Chặn
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Friends;

