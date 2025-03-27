import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../utilities/ThemeContext";
import { Link, useParams } from "react-router-dom";
import { PiUserPlusBold } from "react-icons/pi";
import { getJoinedConversationsById } from "../../../services/ConversationService";
import { ConversationShortResponse } from "../../../types/Conversation";
import { useAuth } from "../../../utilities/AuthContext";
import { timeAgo } from "../../../utilities/timeAgo";
import { useChatContext } from "../../../utilities/ChatContext";
import ConversationAvatar from "./ConversationAvatar";


const ConversationList: React.FC = () => {
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const { conv_id } = useParams();
    const [conversations, setConversations] = useState<ConversationShortResponse[]>([]);
    const [page, setPage] = useState<number>(0);
    const { lastMessages } = useChatContext();
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
                console.log(response);
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
    }, [page]);

    if(loading) return (
        <div className={`max-h-[96vh] overflow-hidden w-full flex items-center justify-center
            pb-0 rounded-xl shadow-sm overflow-y-auto
            ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className={`w-full rounded-lg 
            ${isDarkMode ? 'bg-[#1F1F1F] text-gray-100 border-gray-900' : 'bg-white text-black border-gray-200'}`}>
            <ul className="w-full">
                {conversations.map((conv, index) => {
                    const lastMessageData = lastMessages[conv.id];
                    let lastMessage = "";
                    const lastMessageTime = lastMessageData ? lastMessageData.timestamp : "";

                    if(!lastMessageData || lastMessageData.content == "") {
                        if(conv.lastMessage == null) {
                            lastMessage = "Hãy trò chuyện với nhau";
                        } else if(conv.lastMessage.content == "") {
                            if(conv.lastMessage.urls) {
                                if(conv.lastMessage.senderId == user?.user.id) {
                                    lastMessage = "Bạn đã gửi một " + `${isVideoUrl(conv.lastMessage.urls[conv.lastMessage.urls.length - 1]) ? "video" : "ảnh"}`;
                                } else {
                                    lastMessage = conv.name + " đã gửi một " + `${isVideoUrl(conv.lastMessage.urls[conv.lastMessage.urls.length - 1]) ? "video" : "ảnh"}`;
                                }
                            }
                        } else {
                            if(conv.lastMessage.senderId == user?.user.id) {
                                lastMessage = "Bạn: " + conv.lastMessage.content;
                            } else {
                                lastMessage = conv.lastMessage.content;
                            }
                        }
                    } else {
                        console.log(lastMessageData);
                        if(lastMessageData.senderId == user?.user.id) {
                            if(lastMessageData.content.startsWith("Bạn: ")) {
                                lastMessage = lastMessageData.content;
                            } else {
                                lastMessage = "Bạn: " + lastMessageData.content;
                            }
                        } else {
                            lastMessage = lastMessageData.content;
                        }
                    }

                    return (
                        <Link to={`/conversations/${conv.id}`} key={conv.id}>
                            <li
                                key={conv.id}
                                ref={index === conversations.length - 1 ? lastConversationRef : null}
                                className={`flex items-center p-2.5 rounded-lg cursor-pointer
                                    ${isDarkMode ? 'text-white hover:bg-[#3A3A3A]' : 'text-black hover:bg-gray-100'}
                                    ${conv_id && conv.id === parseInt(conv_id) ? isDarkMode ? 'bg-[#303030]' : 'bg-gray-200' : ''}`}
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
                        <Link to={`/profile/${user?.user.id}/friends`}>
                            <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit rounded-full
                                ${isDarkMode ? 'border-white text-white bg-[#474747] hover:bg-[#5A5A5A]'
                                    : 'border-black text-gray-800 bg-gray-200 hover:bg-gray-300'}
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