import { useEffect, useRef, useState } from "react";
import Modal from "../../common/Modal";
import { useAuth } from "../../../utilities/AuthContext";
import { UserDTO } from "../../../types/User";
import { getUserFriends, searchUsers } from "../../../services/UserService";
import { createConversation } from "../../../services/ConversationService";
import { useTheme } from "../../../utilities/ThemeContext";
import Avatar from "../../common/Avatar";
import { ROUTES } from "../../../utilities/Constants";
type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const CreateNewChatModal = ({ isOpen, onClose }: Props) => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [friends, setFriends] = useState<UserDTO[]>([]);
    const [searchedFriends, setSearchedFriends] = useState<UserDTO[]>([]);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isSearchMode, setIsSearchMode] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch friends on modal open
    useEffect(() => {
        if (!isOpen) return;

        const fetchFriends = async () => {
            setLoading(true);
            setError("");
            setCurrentPage(0);
            setHasMore(true);
            setIsSearchMode(false);
            try {
                if (user?.user.id) {
                    const response = await getUserFriends(user?.user.id, 0);
                    const content = response.result?.content || [];
                    setFriends(content);
                    setHasMore(content.length > 0);
                }
            } catch (err) {
                console.error("Lỗi lấy danh sách bạn bè:", err);
                setError("Không thể tải danh sách bạn bè.");
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [isOpen, user?.user.id]);

    // Load more friends
    const loadMoreFriends = async () => {
        if (loading || !hasMore || isSearchMode) return;

        setLoading(true);
        try {
            if (user?.user.id) {
                const nextPage = currentPage + 1;
                const response = await getUserFriends(user?.user.id, nextPage);
                const newFriends = response.result?.content || [];

                if (newFriends.length > 0) {
                    setFriends(prev => [...prev, ...newFriends]);
                    setCurrentPage(nextPage);
                } else {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Lỗi tải thêm bạn bè:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle scroll for infinite loading
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        // Trigger load more when scrolled to 80% of the content
        if (scrollHeight - scrollTop <= clientHeight * 1.2 && hasMore && !loading && !isSearchMode) {
            loadMoreFriends();
        }
    };

    const handleUserSearch = async () => {
        if (user?.user.id) {
            if (searchTerm.trim() === "") {
                // Reset to friends list
                setIsSearchMode(false);
                setCurrentPage(0);
                const response = await getUserFriends(user?.user.id, 0);
                setFriends(response.result?.content || []);
                return;
            }

            setIsSearchMode(true);
            setLoading(true);
            try {
                const res = await searchUsers(user?.user.id, searchTerm, 0);
                if (res?.result?.content) {
                    const data = res?.result?.content ?? [];
                    setSearchedFriends(data);
                    console.log("Users found:", data);
                }
            } catch (error) {
                console.error("Error searching conversations:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSelectFriend = (id: string) => {
        setSelectedFriendIds((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const handleCreateChat = async () => {
        if (selectedFriendIds.length === 0) return;
        setCreating(true);
        try {
            if (user?.user.id) {
                const request = {
                    participantIds: [user.user.id, ...selectedFriendIds],
                    ownerId: user.user.id,
                    isGroup: selectedFriendIds.length > 1,
                    emoji: "👍"
                };

                const res = await createConversation(request);
                console.log("Tạo thành công:", res.result);

                if (res.code == 1000 && res.result) {
                    window.location.href = `${ROUTES.DESKTOP.CONVERSATION(res.result.id)}`;
                }

                onClose();
                setSelectedFriendIds([]);
                setSearchTerm("");
            }
        } catch (err) {
            console.error("Lỗi tạo cuộc trò chuyện:", err);
            alert("Không thể tạo cuộc trò chuyện.");
        } finally {
            setCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col w-full h-full overflow-y-auto">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 mb-4">
                    <h2 className="text-2xl font-bold mb-1">
                        Tạo cuộc trò chuyện mới
                    </h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedFriendIds.length > 0
                            ? `Đã chọn ${selectedFriendIds.length} người`
                            : 'Chọn bạn bè để bắt đầu trò chuyện'}
                    </p>
                </div>

                {/* Search Bar - Fixed */}
                <div className="flex-shrink-0 relative mb-3">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bạn bè hoặc người dùng..."
                        className={`w-full px-2 py-1 pl-11 focus:outline-none rounded-xl transition-all
                            ${isDarkMode
                                ? 'bg-[#3A3B3C] border border-gray-700 text-gray-100 focus:border-blue-500'
                                : 'bg-gray-50 border border-gray-200 text-gray-700 focus:border-blue-400 focus:bg-white'}
                        `}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            handleUserSearch()
                        }
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                    />
                    <svg
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Selected Friends Pills - Fixed, scrollable if needed */}
                {selectedFriendIds.length > 0 && (
                    <div className="flex-shrink-0 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: isDarkMode ? '#4A4B4C #242526' : '#CBD5E0 #F7FAFC'
                            }}
                        >
                            {[...friends, ...searchedFriends]
                                .filter((v, i, arr) => arr.findIndex(t => t.id === v.id) === i)
                                .filter(f => selectedFriendIds.includes(f.id))
                                .map(friend => (
                                    <div
                                        key={friend.id}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm flex-shrink-0
                                            ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}
                                        `}
                                    >
                                        <img
                                            src={friend.avatarUrl ?? '/images/user_default.avif'}
                                            alt={friend.firstName}
                                            className="w-5 h-5 rounded-full object-cover"
                                        />
                                        <span className="font-medium whitespace-nowrap">
                                            {friend.firstName} {friend.lastName || ''}
                                        </span>
                                        <button
                                            onClick={() => handleSelectFriend(friend.id)}
                                            className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Error Message - Fixed */}
                {error && (
                    <div className="flex-shrink-0 mb-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Friend List - Scrollable, fills remaining space */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className={`flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto p-2 rounded-xl min-h-40
                        ${isDarkMode ? 'bg-[#242526]' : 'bg-gray-50'}
                    `}
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: isDarkMode ? '#4A4B4C #242526' : '#CBD5E0 #F7FAFC'
                    }}
                >
                    {(searchTerm.trim() == '' ? friends : searchedFriends).map((friend) => {
                        const isSelected = selectedFriendIds.includes(friend.id);
                        return (
                            <div
                                key={friend.id}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer flex-shrink-0
                                    ${isSelected
                                        ? isDarkMode
                                            ? 'bg-[#3A3D4A] border-2 border-[#2D88FF]'
                                            : 'bg-[#E7F3FF] border-2 border-[#2D88FF]'
                                        : isDarkMode
                                            ? 'bg-[#3A3B3C] hover:bg-[#4A4B4C] border-2 border-transparent'
                                            : 'bg-white hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                    }
                                `}
                                onClick={() => handleSelectFriend(friend.id)}
                            >
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={friend.avatarUrl ?? '/images/user_default.avif'}
                                        alt={friend.firstName}
                                        className={`w-12 h-12 rounded-full object-cover transition-all
                                            ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                                        `}
                                    />
                                    {isSelected && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2D88FF] rounded-full flex items-center justify-center border-2 border-white dark:border-[#3A3B3C]">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-40 max-w-80">
                                    <p className={`font-semibold truncate ${isSelected ? 'text-[#2D88FF]' : ''}`}>
                                        {friend.firstName} {friend.lastName || ''}
                                    </p>
                                    {friend.location && (
                                        <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {friend.location}
                                        </p>
                                    )}
                                </div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                                    ${isSelected
                                        ? 'bg-[#2D88FF]'
                                        : isDarkMode
                                            ? 'bg-[#4A4B4C] border-2 border-gray-600'
                                            : 'bg-white border-2 border-gray-300'
                                    }
                                `}>
                                    {isSelected && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {loading && (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {!loading && friends.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <svg className={`w-16 h-16 mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {isSearchMode ? 'Không tìm thấy người dùng' : 'Chưa có bạn bè'}
                            </p>
                        </div>
                    )}

                    {!loading && !hasMore && friends.length > 0 && !isSearchMode && (
                        <p className="text-center text-sm text-gray-500 py-3 flex-shrink-0">
                            Đã hiển thị tất cả bạn bè
                        </p>
                    )}
                </div>

            </div>
            {/* Create Button - Fixed at bottom */}
            <button
                onClick={handleCreateChat}
                disabled={selectedFriendIds.length === 0 || creating}
                className={`flex-shrink-0 mt-4 w-full py-3 rounded-xl font-semibold transition-all
                    ${selectedFriendIds.length === 0
                        ? isDarkMode
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }
                `}
            >
                {creating ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Đang tạo...
                    </span>
                ) : (
                    `Tạo cuộc trò chuyện ${selectedFriendIds.length > 1 ? 'nhóm' : ''}`
                )}
            </button>
        </Modal>
    );
};

export default CreateNewChatModal;
