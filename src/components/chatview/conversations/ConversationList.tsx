import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../utilities/ThemeContext";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { PiUserPlusBold } from "react-icons/pi";
import { deleteConversationById, getJoinedConversationsById, updateConversation } from "../../../services/ConversationService";
import { ConversationShortResponse } from "../../../types/Conversation";
import { useAuth } from "../../../utilities/AuthContext";
import { timeAgo } from "../../../utilities/TimeUltilities";
import { useChatContext } from "../../../utilities/ChatContext";
import ConversationAvatar from "./ConversationAvatar";
import { FaEllipsisH } from "react-icons/fa";
import useDeviceTypeByWidth from "../../../utilities/DeviceType";
import { ROUTES } from "../../../utilities/Constants";


const ConversationList: React.FC = () => {
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const { conv_id } = useParams();
    const [searchParams] = useSearchParams();
    const deviceType = useDeviceTypeByWidth();
    const [conversations, setConversations] = useState<ConversationShortResponse[]>([]);
    const [page, setPage] = useState<number>(0);
    const { lastMessages, currentNewMessage } = useChatContext();
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const toggleMenu = (conversationId: string) => {
        setOpenMenuId((prev) => (prev === conversationId ? null : conversationId));
    };

    const sortedConversations = [...conversations].sort((a, b) =>
        new Date(b.lastMessage?.createdAt || 0).getTime() - new Date(a.lastMessage?.createdAt || 0).getTime()
    );

    const observer = useRef<IntersectionObserver | null>(null);
    const lastConversationRef = useCallback((node: HTMLLIElement | null) => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        }, { threshold: 1.0 });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const isVideoUrl = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
        return videoExtensions.some(ext => url.toLowerCase().includes(ext));
    };


    useEffect(() => {
        let isMounted = true;
        const fetchConversations = async () => {
            if (!user || loading || !hasMore) return;
            setLoading(true);
            try {
                const response = await getJoinedConversationsById(user.user.id, page);
                if (!isMounted) return;

                const newConversations = response.result?.content ?? [];

                setConversations((prev) => {
                    const uniqueConversations = [...prev, ...newConversations].filter(
                        (conv, index, self) => index === self.findIndex(c => c.id === conv.id)
                    );
                    return uniqueConversations;
                });

                setHasMore(response.result ? response.result.page.number < response.result.page.totalPages - 1 : false);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách hội thoại:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchConversations();
        return () => {
            isMounted = false; // Cleanup tránh gọi setState khi unmount
        };
    }, [page, conv_id]);
    
    useEffect(() => {
        const fetchConversations = async () => {
            if (!user || loading || !hasMore) return;
            setLoading(true);
            try {
                const response = await getJoinedConversationsById(user.user.id, page);

                const newConversations = response.result?.content ?? [];

                setConversations((prev) => {
                    const uniqueConversations = [...prev, ...newConversations].filter(
                        (conv, index, self) => index === self.findIndex(c => c.id === conv.id)
                    );
                    return uniqueConversations;
                });

                setHasMore(response.result ? response.result.page.number < response.result.page.totalPages - 1 : false);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách hội thoại:", err);
            }
        };

        fetchConversations();
    }, [searchParams]);


    return (
        <div className={`w-full rounded-lg 
            ${isDarkMode ? ' text-gray-100 border-gray-900' : 'bg-white text-black border-gray-200'}`}>
            <ul className="w-full">
                {sortedConversations.map((conv, index) => {
                    const lastMessageData = lastMessages[conv.id];
                    let lastMessage = "";
                    const lastMessageTime = lastMessageData ? lastMessageData.timestamp : "";

                    if (!lastMessageData || lastMessageData.content == "") {
                        if (conv.lastMessage == null) {
                            lastMessage = "Hãy trò chuyện với nhau";
                        } else if (conv.lastMessage.content == "") {
                            if (conv.lastMessage.urls) {
                                if (conv.lastMessage.senderId == user?.user.id) {
                                    lastMessage = "Bạn đã gửi một " + `${isVideoUrl(conv.lastMessage.urls[conv.lastMessage.urls.length - 1]) ? "video" : "ảnh"}`;
                                } else {
                                    lastMessage = conv.name + " đã gửi một " + `${isVideoUrl(conv.lastMessage.urls[conv.lastMessage.urls.length - 1]) ? "video" : "ảnh"}`;
                                }
                            }
                        } else {
                            if (conv.lastMessage.senderId == user?.user.id) {
                                lastMessage = "Bạn: " + conv.lastMessage.content;
                            } else {
                                lastMessage = conv.lastMessage.content;
                            }
                        }
                    } else {
                        if (lastMessageData.senderId == user?.user.id) {
                            if (lastMessageData.content.startsWith("Bạn: ")) {
                                lastMessage = lastMessageData.content;
                            } else {
                                lastMessage = "Bạn: " + lastMessageData.content;
                            }
                        } else {
                            lastMessage = lastMessageData.content;
                        }
                    }

                    return (
                        <Link to={`${deviceType == 'Mobile' 
                                ? `${ROUTES.MOBILE.CONVERSATION(conv.id)}`
                                : `${ROUTES.DESKTOP.CONVERSATION(conv.id)}`}`} 
                            key={conv.id}>
                            <li
                                key={conv.id}
                                ref={index === conversations.length - 1 ? lastConversationRef : null}
                                className={`relative flex items-center p-2.5 rounded-lg cursor-pointer group
                                    ${isDarkMode ? 'text-white hover:bg-[#28282A]' : 'text-black hover:bg-gray-100'}
                                    ${conv_id && conv.id === conv_id ? isDarkMode ? 'bg-[#2e2e2e]' : 'bg-gray-200' : ''}`}
                            >
                                <ConversationAvatar avatarUrls={conv.avatarUrls != undefined ? conv.avatarUrls : []}
                                    width={12} height={12}></ConversationAvatar>
                                <div className="flex-1 max-w-[80%] ms-4">
                                    <p className={`text-md font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                        {conv.name}
                                    </p>
                                    <div className="w-full flex items-center justify-between">
                                        <p className={`text-[13px] truncate max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap
                                            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {lastMessage}
                                        </p>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {!lastMessageData ? timeAgo(conv.lastMessage != null ? conv.lastMessage.createdAt : '') : timeAgo(lastMessageTime)}</p>
                                    </div>
                                </div>

                                <div className={` absolute hidden gap-1 right-12 group-hover:flex`}>
                                    <button className={`p-2 rounded-full text-md border
                                            ${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#242424] hover:text-gray-200'
                                            : 'text-gray-600 border-gray-600 hover:text-gray-500'}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleMenu(conv.id);
                                        }}
                                    >
                                        <FaEllipsisH />
                                    </button>
                                </div>
                                {/* Menu */}
                                {openMenuId === conv.id && (
                                    <div className={`absolute top-10 right-0 mt-2 shadow-lg rounded-xl w-40 z-10
                                        ${isDarkMode ? 'bg-[#161618]' : 'bg-[#ffffff]'}`}>
                                        <button
                                            className={`w-max text-left px-4 py-3 
                                                ${isDarkMode ? 'hover:bg-[#242424]' : 'hover:bg-gray-100'}
                                                ${conv.group == true ? 'rounded-t-xl' : 'rounded-xl'}
                                            `}
                                            onClick={async () => {
                                                const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá đoạn chat này?");
                                                if (confirmDelete) {
                                                    await deleteConversationById(conv.id);
                                                    console.log("Đã xoá đoạn chat thành công!");
                                                }
                                            }}
                                        >
                                            🗑️ Xoá đoạn chat
                                        </button>
                                        {conv.group && (
                                            <button
                                                className="w-full text-left px-4 py-3 rounded-b-xl hover:bg-gray-100 dark:hover:bg-[#242424]"
                                                onClick={async () => {
                                                    if (user?.user.id && conv.participantIds) {
                                                        const confirmDelete = window.confirm("Bạn có chắc chắn muốn rời khỏi đoạn chat này?");
                                                        if (confirmDelete) {
                                                            const participantIds = conv.participantIds.filter(id => id !== user?.user.id);
                                                            await updateConversation({ participantIds }, user?.user.id);
                                                        }
                                                    }
                                                    console.log("Đã cập nhật cuộc trò chuyện!");
                                                }}
                                            >
                                                🚪 Rời cuộc trò chuyện
                                            </button>
                                        )}
                                    </div>
                                )}
                            </li>
                        </Link>
                    )
                })}
                {loading &&
                    <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>}

                {!loading && conversations.length < 6 && (
                    <div className="flex flex-col justify-center items-center border-t border-gray-400 mt-2">
                        <p className={`text-center text-md font-semibold py-4 px-10
                            ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Hãy tìm kiếm bạn bè để bắt đầu các cuộc trò chuyện
                        </p>
                        <Link to={`${deviceType == 'Mobile' 
                            ? `${ROUTES.MOBILE.PROFILE_FRIENDS(user?.user.id)}`
                            : `${ROUTES.DESKTOP.PROFILE_FRIENDS(user?.user.id)}`
                            }`}>
                            <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit rounded-full
                                ${isDarkMode ? 'border-white text-white hover:bg-[#2e2e2e]'
                                    : 'border-black text-gray-800 hover:bg-gray-200'}
                                border-2 shadow-md transition duration-200`}>
                                <PiUserPlusBold />
                                <p className="font-semibold">Tìm bạn bè</p>
                            </button>
                        </Link>
                    </div>
                )}
            </ul>
        </div>
    );
};

export default ConversationList;