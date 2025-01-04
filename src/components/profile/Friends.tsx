import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { friendsData } from "../../FakeData";
import FriendCard from "./FriendCard";
import SearchBar from "../homeview/conversations/SearchBar";
import { ImBlocked } from "react-icons/im";
import { IoChatbubblesSharp } from "react-icons/io5";
import { useState } from "react";
import FriendRequestCard from "./FriendRequestCard";
import UserCard from "./UserCard";



const Friends = () => {
    const [activeTab, setActiveTab] = useState('allFriends');
    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

    const toggleFriendMenuOpen = (id: string) => {
        setSelectedFriendId(prevId => (prevId === id ? null : id)); 
    };
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const otherUser = false;

    const friends = friendsData;

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex flex-col bg-white
            pb-0 rounded-xl border border-gray-200 shadow-sm overflow-y-auto">

                <div className="sticky top-0 z-10 w-full bg-white flex px-4 pt-2
                    items-center justify-center border-b-2 border-gray-200">
                    <div className="absolute top-3 left-4 z-10">
                        <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-100"
                            onClick={goBack}>
                            <FaArrowLeft />
                        </button>
                    </div>
                    
                    {!otherUser ? (
                    <div className="flex flex-row items-center justify-center rounded-md">
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg
                            ${activeTab === 'allFriends' ? 'border-b-[3px] border-blue-600' 
                                : 'hover:bg-gray-200 border-b-[3px]'}`}
                            onClick={() => setActiveTab('allFriends')}>
                            Tất cả bạn bè
                        </button>
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg
                            ${activeTab === 'friendRequests' ? 'border-b-[3px] border-blue-600' 
                                : 'hover:bg-gray-200 border-b-[3px]'}`}
                            onClick={() => setActiveTab('friendRequests')}>
                            Lời mời kết bạn
                        </button>
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg
                            ${activeTab === 'findFriends' ? 'border-b-[3px] border-blue-600' 
                                : 'hover:bg-gray-200 border-b-[3px]'}`}
                            onClick={() => setActiveTab('findFriends')}>
                            Tìm bạn bè
                        </button>
                        </div>
                        ) : (
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg
                            ${activeTab === 'findFriends' ? 'border-b-[3px] border-blue-600' 
                                : 'hover:bg-gray-200 border-b-[3px]'}`}
                            onClick={() => setActiveTab('mutualFriends')}>
                            Bạn chung
                        </button>
                        )}
                    
                    <div className="w-[300px] absolute top-3 right-4">
                        <SearchBar />
                    </div>
                </div>
            <div className="min-h-[86vh] max-h-[90vh] overflow-y-auto">
                <div className="w-full flex items-center justify-center gap-4 flex-wrap p-4">
                    
                    {/* All friends */}
                    {activeTab == 'allFriends' && friends.map((friend, index) => (
                        <div className="relative" key={friend.id}>
                            <FriendCard key={friend.id} friend={friend}
                                        isOpen={selectedFriendId === friend.id}
                                        toggleFriendMenuOpen={() => toggleFriendMenuOpen(friend.id)} />
                            {selectedFriendId === friend.id && (
                                <div className={`absolute right-10 ${index + 5 > friends.length ? '-top-40 ' : 'top-16'} 
                                    mt-2 w-64 bg-white border rounded-lg shadow-lg z-10`}>
                                    <ul className="text-gray-700 p-1">
                                        <Link to={"/profile"}>
                                            <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                                font-bold hover:bg-gray-100 cursor-pointer">
                                                <img src={friend.avatar} className="w-8 h-8 rounded-full"/>
                                                Xem trang cá nhân
                                            </li>
                                        </Link>
                                        <hr></hr>
                                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold 
                                            hover:bg-gray-100 cursor-pointer">
                                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 
                                                hover:bg-gray-200">
                                                <IoChatbubblesSharp />
                                            </button>
                                            Nhắn tin
                                        </li>
                                        <hr></hr>
                                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                            font-bold hover:bg-gray-100 cursor-pointer">
                                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 
                                                hover:bg-gray-200">
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
                        <div className="relative" key={friend.id}>
                            <FriendRequestCard key={friend.id} friend={friend}
                                        isOpen={selectedFriendId === friend.id}
                                        toggleFriendMenuOpen={() => toggleFriendMenuOpen(friend.id)} />
                            {selectedFriendId === friend.id && (
                                <div className={`absolute right-10 ${index + 5 > friends.length ? '-top-40 ' : 'top-16'} 
                                    mt-2 w-64 bg-white border rounded-lg shadow-lg z-10`}>
                                    <ul className="text-gray-700 p-1">
                                        <Link to={"/profile"}>
                                            <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                                font-bold hover:bg-gray-100 cursor-pointer">
                                                <img src={friend.avatar} className="w-8 h-8 rounded-full"/>
                                                Xem trang cá nhân
                                            </li>
                                        </Link>
                                        <hr></hr>
                                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold 
                                            hover:bg-gray-100 cursor-pointer">
                                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 
                                                hover:bg-gray-200">
                                                <IoChatbubblesSharp />
                                            </button>
                                            Nhắn tin
                                        </li>
                                        <hr></hr>
                                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                            font-bold hover:bg-gray-100 cursor-pointer">
                                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 
                                                hover:bg-gray-200">
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
                        <div className="relative" key={friend.id}>
                            <UserCard key={friend.id} friend={friend}
                                        isOpen={selectedFriendId === friend.id}
                                        toggleFriendMenuOpen={() => toggleFriendMenuOpen(friend.id)} />
                            {selectedFriendId === friend.id && (
                                <div className={`absolute right-10 ${index + 5 > friends.length ? '-top-40 ' : 'top-16'} 
                                    mt-2 w-64 bg-white border rounded-lg shadow-lg z-10`}>
                                    <ul className="text-gray-700 p-1">
                                        <Link to={"/profile"}>
                                            <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                                font-bold hover:bg-gray-100 cursor-pointer">
                                                <img src={friend.avatar} className="w-8 h-8 rounded-full"/>
                                                Xem trang cá nhân
                                            </li>
                                        </Link>
                                        <hr></hr>
                                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold 
                                            hover:bg-gray-100 cursor-pointer">
                                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 
                                                hover:bg-gray-200">
                                                <IoChatbubblesSharp />
                                            </button>
                                            Nhắn tin
                                        </li>
                                        <hr></hr>
                                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                            font-bold hover:bg-gray-100 cursor-pointer">
                                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 
                                                hover:bg-gray-200">
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
                        <div className="relative" key={friend.id}>
                            <FriendCard key={friend.id} friend={friend}
                                        isOpen={selectedFriendId === friend.id}
                                        toggleFriendMenuOpen={() => toggleFriendMenuOpen(friend.id)} />
                            {selectedFriendId === friend.id && (
                                <div className={`absolute right-10 ${index + 5 > friends.length ? '-top-40 ' : 'top-16'} 
                                    mt-2 w-64 bg-white border rounded-lg shadow-lg z-10`}>
                                    <ul className="text-gray-700 p-1">
                                        <Link to={"/profile"}>
                                            <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                                font-bold hover:bg-gray-100 cursor-pointer">
                                                <img src={friend.avatar} className="w-8 h-8 rounded-full"/>
                                                Xem trang cá nhân
                                            </li>
                                        </Link>
                                        <hr></hr>
                                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold 
                                            hover:bg-gray-100 cursor-pointer">
                                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 
                                                hover:bg-gray-200">
                                                <IoChatbubblesSharp />
                                            </button>
                                            Nhắn tin
                                        </li>
                                        <hr></hr>
                                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg 
                                            font-bold hover:bg-gray-100 cursor-pointer">
                                            <button className="p-2 rounded-full text-black text-xl bg-gray-200 
                                                hover:bg-gray-200">
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

