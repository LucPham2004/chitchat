import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import FriendCard from "./friends/FriendCard";
import SearchBar from "../common/SearchBar";
import { useEffect, useState } from "react";
import FriendRequestCard from "./friends/FriendRequestCard";
import UserCard from "./friends/UserCard";
import { useTheme } from "../../utilities/ThemeContext";
import { useAuth } from "../../utilities/AuthContext";
import FriendItemWithModal from "./friends/FriendItemWithModal";
import { UserDTO } from "../../types/User";
import { getMutualFriends, getSuggestedFriends, getUserFriendRequests, getUserFriends, searchUsers } from "../../services/UserService";



const Friends = () => {
    const { user } = useAuth();
    const { user_id_param } = useParams();
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState(user_id_param == user?.user.id ? 'allFriends' : 'mutualFriends');
    const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);

    const [friends, setFriends] = useState<UserDTO[]>([]);
    const [pageNum, setPageNum] = useState(0);
    const [loading, setLoading] = useState(false);

    const [searchedUsers, setSearchedUsers] = useState<UserDTO[] | null>(null);
    const [clearInput, setclearInput] = useState(false);

    const toggleFriendMenuOpen = (id: number) => {
        setSelectedFriendId(prevId => (prevId === id ? null : id));
    };
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const isOtherUser = user_id_param != user?.user.id;

    const handleUserSearch = async (keyword: string) => {
        if(user?.user.id) {
            if (keyword.trim() === "") {
                setSearchedUsers(null);
                return;
            }
            try {
                const data = await searchUsers(user?.user.id, keyword, 0);
                if (data?.result?.content) {
                    setFriends(data.result?.content);
                    console.log("Users found:", data);
                }
            } catch (error) {
                console.error("Error searching conversations:", error);
            }
        }
      };
      
    const handleClearSearch = () => {
        setFriends([]);
        fetchFriendsData();
    };

    const fetchFriendsData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            let res;

            switch (activeTab) {
                case 'allFriends':
                    res = await getUserFriends(user.user.id, pageNum);
                    break;
                case 'friendRequests':
                    res = await getUserFriendRequests(user.user.id, pageNum);
                    break;
                case 'findFriends':
                    res = await getSuggestedFriends(user.user.id, pageNum);
                    break;
                case 'mutualFriends':
                    if (user_id_param) {
                        res = await getMutualFriends(user.user.id, parseInt(user_id_param), pageNum);
                    }
                    break;
                default:
                    res = await getUserFriends(user.user.id, pageNum);
            }

            console.log(res)

            if (res?.result?.content) {
                setFriends(res.result.content);
            } else {
                setFriends([]);
            }
        } catch (error) {
            console.error("Failed to fetch friends data:", error);
            setFriends([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendsData();
    }, [activeTab, pageNum, user_id_param]);

    useEffect(() => {
        document.title = "Bạn bè | Chit Chat";
    }, []);


    const getCardComponent = (activeTab: string) => {
        switch (activeTab) {
            case "allFriends":
            case "mutualFriends":
                return FriendCard;
            case "friendRequests":
                return FriendRequestCard;
            case "findFriends":
                return UserCard;
            default:
                return FriendCard;
        }
    };

    const cardComponent = getCardComponent(activeTab);

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

                {!isOtherUser ? (
                    <div className="flex flex-row items-center justify-center rounded-md ms-[40px]">
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                            ${activeTab === 'allFriends' ?
                                isDarkMode ? 'text-gray-100 border-blue-600' : 'border-blue-600'
                                : isDarkMode ? 'text-gray-400 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-200'}`}
                            onClick={() => {
                                setActiveTab('allFriends');
                                setSelectedFriendId(null);
                            }}>
                            Tất cả bạn bè
                        </button>
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                            ${activeTab === 'friendRequests' ?
                                isDarkMode ? 'text-gray-100 border-blue-600' : 'border-blue-600'
                                : isDarkMode ? 'text-gray-400 hover:bg-[#5A5A5A]' : 'text-black hover:bg-gray-200'}`}
                            onClick={() => {
                                setActiveTab('friendRequests');
                                setSelectedFriendId(null);
                            }}>
                            Lời mời kết bạn
                        </button>
                        <button className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                            ${activeTab === 'findFriends' ?
                                isDarkMode ? 'text-gray-100 border-blue-600' : 'border-blue-600'
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
                            isDarkMode ? 'text-gray-100 border-blue-600' : 'border-blue-600'
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
                <div className="w-full flex items-center justify-start gap-4 flex-wrap p-4">

                    {loading && (
                        <div className={`max-h-[96vh] overflow-hidden w-full flex items-center justify-center
                            pb-0 rounded-xl border shadow-sm overflow-y-auto
                            ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
                        </div>
                    )}

                    {friends.length > 0 && activeTab != 'friendRequests' && (
                        <div className="w-full">
                            <div className="flex justify-end">
                                <SearchBar placeholder="Tìm kiếm bạn bè..." onSearch={handleUserSearch} onClear={handleClearSearch}/>
                            </div>
                        </div>
                    )}

                    {/* All friends */}
                    {activeTab == 'allFriends' && (friends.length > 0 && !loading ? friends.map((friend, index) => (
                        <FriendItemWithModal
                            key={friend.id}
                            friend={friend}
                            index={index}
                            isOpen={selectedFriendId === friend.id}
                            toggleMenu={() => toggleFriendMenuOpen(friend.id)}
                            isDarkMode={isDarkMode}
                            CardComponent={cardComponent}
                        />
                    ))
                    : (
                        <div className="flex flex-col justify-center items-center w-full border-t border-gray-400 mt-2">
                            <p className={`text-center text-md font-semibold py-4 px-10
                                                ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                Bạn hiện chưa có bạn bè. Hãy tìm kiếm và bắt đầu các cuộc trò chuyện
                            </p>
                        </div>
                    ))}

                    {/* Friend requests */}
                    {activeTab == 'friendRequests' && (friends.length > 0 && !loading ? friends.map((friend, index) => (
                        <FriendItemWithModal
                            key={friend.id}
                            friend={friend}
                            index={index}
                            isOpen={selectedFriendId === friend.id}
                            toggleMenu={() => toggleFriendMenuOpen(friend.id)}
                            isDarkMode={isDarkMode}
                            CardComponent={cardComponent}
                        />
                    ))
                    : (
                        <div className="flex flex-col justify-center items-center w-full border-t border-gray-400 mt-2">
                            <p className={`text-center text-md font-semibold py-4 px-10
                                                ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                Bạn không có lời mời kết bạn nào
                            </p>
                        </div>
                    ))}

                    {/* Find friends */}
                    {activeTab == 'findFriends' && friends.map((friend, index) => (
                        <FriendItemWithModal
                            key={friend.id}
                            friend={friend}
                            index={index}
                            isOpen={selectedFriendId === friend.id}
                            toggleMenu={() => toggleFriendMenuOpen(friend.id)}
                            isDarkMode={isDarkMode}
                            CardComponent={cardComponent}
                        />
                    ))}

                    {/* Mutual friends */}
                    {activeTab == 'mutualFriends' && (friends.length > 0 && !loading ? friends.map((friend, index) => (
                        <FriendItemWithModal
                            key={friend.id}
                            friend={friend}
                            index={index}
                            isOpen={selectedFriendId === friend.id}
                            toggleMenu={() => toggleFriendMenuOpen(friend.id)}
                            isDarkMode={isDarkMode}
                            CardComponent={cardComponent}
                        />
                    ))
                    : (
                        <div className="flex flex-col justify-center items-center w-full border-t border-gray-400 mt-2">
                            <p className={`text-center text-md font-semibold py-4 px-10
                                                ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                Các bạn không có bạn chung nào
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Friends;

