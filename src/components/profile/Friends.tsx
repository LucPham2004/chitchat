import { FaArrowLeft, FaBars } from "react-icons/fa";
import { data, Link, useNavigate, useParams } from "react-router-dom";
import FriendCard from "./friends/FriendCard";
import SearchBar from "../common/SearchBar";
import { useEffect, useRef, useState } from "react";
import FriendRequestCard from "./friends/FriendRequestCard";
import UserCard from "./friends/UserCard";
import { useTheme } from "../../utilities/ThemeContext";
import { useAuth } from "../../utilities/AuthContext";
import FriendItemWithModal from "./friends/FriendItemWithModal";
import { UserDTO } from "../../types/User";
import { getMutualFriends, getSuggestedFriends, getUserFriendRequests, getUserFriends, searchUsers } from "../../services/UserService";
import useDeviceTypeByWidth from "../../utilities/useDeviceTypeByWidth";



const Friends = () => {
    const { user } = useAuth();
    const { user_id_param } = useParams();
    const deviceType = useDeviceTypeByWidth();
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState(user_id_param == user?.user.id ? 'allFriends' : 'mutualFriends');
    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

    const [friends, setFriends] = useState<UserDTO[]>([]);
    const [friendRequests, setFriendRequests] = useState<UserDTO[]>([]);
    const [friendSuggests, setFriendSuggests] = useState<UserDTO[]>([]);

    const [pageInfoMap, setPageInfoMap] = useState<Record<string, any>>({});
    const [pageNumMap, setPageNumMap] = useState<Record<string, number>>({});

    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const toggleFriendMenuOpen = (id: string) => {
        setSelectedFriendId(prevId => (prevId === id ? null : id));
    };
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const isOtherUser = user_id_param != user?.user.id;

    const handleUserSearch = async (keyword: string) => {
        if (user?.user.id) {
            if (keyword.trim() === "") {
                return;
            }
            try {
                const res = await searchUsers(user?.user.id, keyword, 0);
                if (res?.result?.content) {
                    
                const data = res?.result?.content ?? [];
                    switch (activeTab) {
                        case 'allFriends':
                            setFriends(prev => (0 === 0 ? data : [...prev, ...data]));
                            break;
                        case 'friendRequests':
                            setFriendRequests(prev => (0 === 0 ? data : [...prev, ...data]));
                            break;
                        case 'findFriends':
                            setFriendSuggests(prev => (0 === 0 ? data : [...prev, ...data]));
                            break;
                        case 'mutualFriends':
                            setFriends(prev => (0 === 0 ? data : [...prev, ...data]));
                            break;
                    }
                    setPageInfoMap(prev => ({ ...prev, [activeTab]: 0 }));
                    console.log("Users found:", data);
                }
            } catch (error) {
                console.error("Error searching conversations:", error);
            }
        }
    };

    const handleClearSearch = () => {
        setFriends([]);
        fetchFriendsData(activeTab, 0);
    };

    const fetchFriendsData = async (tab: string, page: number) => {
        if (!user) return;
        if (loading) return;

        const tabPageInfo = pageInfoMap[tab];
        if (tabPageInfo && page + 1 > tabPageInfo.totalPages) return;

        setLoading(true);
        try {
            let res;
            switch (tab) {
                case 'allFriends':
                    res = await getUserFriends(user.user.id, page);
                    break;
                case 'friendRequests':
                    res = await getUserFriendRequests(user.user.id, page);
                    break;
                case 'findFriends':
                    res = await getSuggestedFriends(user.user.id, page);
                    break;
                case 'mutualFriends':
                    if (user_id_param) {
                        res = await getMutualFriends(user.user.id, user_id_param, page);
                    }
                    break;
            }

            const data = res?.result?.content ?? [];
            const newPage = res?.result?.page;

            setPageInfoMap(prev => ({ ...prev, [tab]: newPage }));
            setPageNumMap(prev => ({ ...prev, [tab]: page }));

            switch (tab) {
                case 'allFriends':
                    setFriends(prev => (page === 0 ? data : [...prev, ...data]));
                    break;
                case 'friendRequests':
                    setFriendRequests(prev => (page === 0 ? data : [...prev, ...data]));
                    break;
                case 'findFriends':
                    setFriendSuggests(prev => (page === 0 ? data : [...prev, ...data]));
                    break;
                case 'mutualFriends':
                    setFriends(prev => (page === 0 ? data : [...prev, ...data]));
                    break;
            }
        } catch (err) {
            console.error("Failed to fetch friends data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const currentList =
            activeTab === 'allFriends'
                ? friends
                : activeTab === 'friendRequests'
                    ? friendRequests
                    : activeTab === 'findFriends'
                        ? friendSuggests
                        : friends;

        if (!currentList || currentList.length === 0) {
            fetchFriendsData(activeTab, 0);
        }
    }, [activeTab, user_id_param]);

    useEffect(() => {
        document.title = "Bạn bè | Chit Chat";
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const tabPageInfo = pageInfoMap[activeTab];
            const tabPageNum = pageNumMap[activeTab] ?? 0;

            if (
                !loading &&
                tabPageInfo &&
                tabPageInfo.totalPages &&
                tabPageNum + 1 < tabPageInfo.totalPages &&
                container.scrollTop + container.clientHeight >= container.scrollHeight - 100
            ) {
                const nextPage = tabPageNum + 1;
                fetchFriendsData(activeTab, nextPage);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [loading, pageInfoMap, pageNumMap, activeTab]);

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
        <div className={`overflow-hidden w-full flex flex-col pb-0 rounded-xl bordershadow-sm overflow-y-auto
            ${deviceType !== 'Mobile' ? 'max-h-[96vh] min-h-[96vh]' : 'h-[100vh]'}
            ${isDarkMode ? 'bg-[#161618] text-gray-300 border-gray-900' : 'bg-white text-black border-gray-200'}`}
            onClick={() => setShowMenu(!showMenu)}>

            <div className={`sticky top-0 z-10 w-full flex px-4 pt-2
                    items-center justify-end md:justify-center border-b-2
                    ${isDarkMode ? 'bg-[#161618] text-gray-300 border-gray-900' : 'bg-white text-black border-gray-200'}`}>
                <div className="absolute top-3 left-4 z-10">
                    <button className={`p-2 rounded-full text-xl
                    ${isDarkMode ? 'text-gray-200 bg-[#474747] hover:bg-[#5A5A5A]'
                            : 'text-black bg-gray-200 hover:bg-gray-100'}`}
                        onClick={goBack}>
                        <FaArrowLeft />
                    </button>
                </div>


                {/* ✅ MOBILE: Nút menu */}
                {!isOtherUser && (
                    <div className="flex md:hidden items-center justify-center">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className={`p-2 rounded-md text-md font-semibold flex items-center gap-2
                                ${isDarkMode ? 'bg-[#2C2C2C] text-gray-200' : 'bg-gray-100 text-black'}`}
                        >
                            <FaBars />
                            <span>Danh mục</span>
                        </button>

                        {/* Dropdown menu */}
                        {showMenu && (
                            <div
                                className={`absolute top-[60px] right-4 rounded-lg shadow-lg border
                                    ${isDarkMode ? 'bg-[#1E1E1E] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-black'}`}
                            >
                                {[
                                    { key: 'allFriends', label: 'Tất cả bạn bè' },
                                    { key: 'friendRequests', label: 'Lời mời kết bạn' },
                                    { key: 'findFriends', label: 'Tìm bạn bè' },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            setActiveTab(tab.key);
                                            setSelectedFriendId(null);
                                            setShowMenu(false);
                                        }}
                                        className={`block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-[#333]
                                            ${activeTab === tab.key ? 'font-semibold text-blue-600' : ''}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ✅ DESKTOP: Tabs như cũ */}
                {!isOtherUser && (
                    <div className="hidden md:flex flex-row items-center justify-center rounded-md ms-[40px]">
                        <button
                            className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                                ${activeTab === 'allFriends'
                                    ? isDarkMode
                                        ? 'text-gray-100 border-blue-600'
                                        : 'border-blue-600'
                                    : isDarkMode
                                        ? 'text-gray-400 hover:bg-[#5A5A5A]'
                                        : 'text-black hover:bg-gray-200'}`}
                            onClick={() => {
                                setActiveTab('allFriends');
                                setSelectedFriendId(null);
                            }}
                        >
                            Tất cả bạn bè
                        </button>
                        <button
                            className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                                ${activeTab === 'friendRequests'
                                    ? isDarkMode
                                        ? 'text-gray-100 border-blue-600'
                                        : 'border-blue-600'
                                    : isDarkMode
                                        ? 'text-gray-400 hover:bg-[#5A5A5A]'
                                        : 'text-black hover:bg-gray-200'}`}
                            onClick={() => {
                                setActiveTab('friendRequests');
                                setSelectedFriendId(null);
                            }}
                        >
                            Lời mời kết bạn
                        </button>
                        <button
                            className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                                ${activeTab === 'findFriends'
                                    ? isDarkMode
                                        ? 'text-gray-100 border-blue-600'
                                        : 'border-blue-600'
                                    : isDarkMode
                                        ? 'text-gray-400 hover:bg-[#5A5A5A]'
                                        : 'text-black hover:bg-gray-200'}`}
                            onClick={() => {
                                setActiveTab('findFriends');
                                setSelectedFriendId(null);
                            }}
                        >
                            Tìm bạn bè
                        </button>
                    </div>
                )}

                {/* Khi là trang khác user */}
                {isOtherUser && (
                    <button
                        className={`w-max h-fit py-3 px-4 text-md font-semibold rounded-t-lg border-b-[3px]
                            ${activeTab === 'mutualFriends'
                                ? isDarkMode
                                    ? 'text-gray-100 border-blue-600'
                                    : 'border-blue-600'
                                : isDarkMode
                                    ? 'text-gray-400 hover:bg-[#5A5A5A]'
                                    : 'text-black hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('mutualFriends')}
                    >
                        Bạn chung
                    </button>
                )}
            </div>
            <div
                ref={scrollContainerRef}
                className="min-h-[86vh] max-h-[90vh] overflow-y-auto"
            >
                <div className="w-full flex items-center justify-start gap-4 flex-wrap p-4">

                    {((friends.length > 0 && activeTab != 'friendRequests') || activeTab == 'findFriends') && (
                        <div className="w-full">
                            <div className="flex justify-end">
                                <SearchBar placeholder="Tìm kiếm bạn bè..." onSearch={handleUserSearch} onClear={handleClearSearch} />
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
                            <div className="flex flex-col justify-center items-center w-full border-gray-400 ">
                                <p className={`text-center text-md font-semibold py-4 px-10
                                                ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Bạn hiện chưa có bạn bè. Hãy tìm kiếm và bắt đầu các cuộc trò chuyện
                                </p>
                            </div>
                        ))}

                    {/* Friend requests */}
                    {activeTab == 'friendRequests' && (friendRequests.length > 0 && !loading ? friendRequests.map((friend, index) => (
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
                            <div className="flex flex-col justify-center items-center w-full border-gray-400">
                                <p className={`text-center text-md font-semibold py-4 px-10
                                                ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Bạn không có lời mời kết bạn nào
                                </p>
                            </div>
                        ))}

                    {/* Find friends */}
                    {activeTab == 'findFriends' && (friendSuggests.length > 0 && !loading ? friendSuggests.map((friend, index) => (
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
                            <div className="flex flex-col justify-center items-center w-full border-gray-400">
                                <p className={`text-center text-md font-semibold py-4 px-10
                                                ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Danh sách rỗng
                                </p>
                            </div>
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

