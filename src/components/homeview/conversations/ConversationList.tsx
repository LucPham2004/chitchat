import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../utilities/ThemeContext";
import { Link } from "react-router-dom";
import { PiUserPlusBold } from "react-icons/pi";
import { getJoinedConversationsById } from "../../../services/ConversationService";
import { ConversationShortResponse } from "../../../types/Conversation";
import { useAuth } from "../../../utilities/AuthContext";
import { timeAgo } from "../../../utilities/timeAgo";


const ConversationList: React.FC = () => {
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationShortResponse[]>([]);
    const [page, setPage] = useState<number>(0);
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
    

    return (
        <div className={`w-full rounded-lg 
            ${isDarkMode ? 'bg-[#1F1F1F] text-gray-100 border-gray-900' : 'bg-white text-black border-gray-200'}`}>
            <ul className="w-full">
                {conversations.map((conv, index) => (
                    <Link to={`/conversations/${conv.id}`} key={conv.id}>
                        <li
                            key={conv.id}
                            ref={index === conversations.length - 1 ? lastConversationRef : null}
                            className={`flex items-center p-2.5 rounded-lg cursor-pointer
                                ${isDarkMode ? 'text-white hover:bg-[#3A3A3A]' : 'text-black hover:bg-gray-100'}`}
                        >
                            <img
                                src={conv.avatarUrl}
                                alt={conv.name}
                                className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                            <div className="flex-1 max-w-[90%]">
                                <h4 className={`text-md font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {conv.name}
                                </h4>
                                <div className="w-full flex items-center justify-between">
                                    <p className={`text-sm truncate w-[80%] overflow-hidden text-ellipsis whitespace-nowrap
                                        ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {conv.lastMessage}
                                    </p>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}> 
                                        {timeAgo(conv.lastMessageTime)}</p>
                                </div>
                            </div>
                        </li>
                    </Link>
                ))}
                {loading && 
                    <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>}
                
                {!loading && conversations.length === 0 && (
                    <div className="flex flex-col justify-center items-center">
                        <p className={`text-center text-md font-semibold py-4 px-10
                            ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Hãy tìm kiếm bạn bè để bắt đầu các cuộc trò chuyện
                        </p>
                        <Link to="/profile/friends">
                            <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit rounded-full
                                ${isDarkMode ? 'border-white' : 'border-black'}
                                border-2 border-black text-white bg-[#474747] hover:bg-[#5A5A5A]
                                shadow-md transition duration-200`}>
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