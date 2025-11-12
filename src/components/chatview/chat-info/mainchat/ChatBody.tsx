import { useRef, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import useDeviceTypeByWidth from "../../../../utilities/DeviceType";
import { useTheme } from "../../../../utilities/ThemeContext";
import { useAuth } from "../../../../utilities/AuthContext";
import { ChatResponse } from "../../../../types/Message";
import { ConversationResponse } from "../../../../types/Conversation";
import { getConversationMessages } from "../../../../services/MessageService";
import { useParams } from "react-router-dom";
import { useChatContext } from "../../../../utilities/ChatContext";
import { ChatParticipants } from "../../../../types/User";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/vi";

dayjs.extend(localizedFormat);
dayjs.locale("vi");


interface MessagesProps {
    messages: ChatResponse[];
    setMessages: React.Dispatch<React.SetStateAction<ChatResponse[]>>;
    conversationResponse: ConversationResponse;
    participants?: ChatParticipants[];
    files?: File[];
    onDeleteMessage: (id: string) => void;
	replyTo: ChatResponse | null;
    onReply: React.Dispatch<React.SetStateAction<ChatResponse | null>>;
}

const ChatBody: React.FC<MessagesProps> = ({ messages, setMessages, conversationResponse, participants, files, onDeleteMessage, replyTo, onReply }) => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const deviceType = useDeviceTypeByWidth();

    const { setIsDisplayMedia } = useChatContext();
    const { setDisplayMediaUrl } = useChatContext();

    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const { conv_id } = useParams();
    const [pageNum, setPageNum] = useState(0);
    const pageNumRef = useRef(0);
    const [isFetching, setIsFetching] = useState(false);
    const { updateLastMessage } = useChatContext();
    const [hasMore, setHasMore] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const hasFetchedInitialMessages = useRef(false); // Trạng thái tải tin nhắn đầu tiên

    // Kiểm tra xem chat có đang ở cuối không
    const checkIsAtBottom = () => {
        if (!chatContainerRef.current) return false;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        return scrollTop + clientHeight >= scrollHeight - 10; // Chênh lệch nhỏ để tránh sai số
    };

    // Hàm tải tin nhắn cũ khi kéo lên
    const fetchOlderMessages = async () => {
        if (!conversationResponse || isFetching || !hasMore) return;
        setIsFetching(true);

        try {
            const chatContainer = chatContainerRef.current;
            const prevScrollHeight = chatContainer?.scrollHeight || 0; // Lưu vị trí trước khi thêm tin nhắn

            const newPageNum = pageNumRef.current + 1;
            console.log("Fetching older messages page num: ", newPageNum);
            const response = await getConversationMessages(conversationResponse.id, newPageNum);

            console.log(response);

            if (response.result && response.result.content.length > 0) {

                const newMessages = response.result?.content.reverse() || [];
                setMessages((prev) => [...newMessages, ...prev]);
                pageNumRef.current = newPageNum;
                setPageNum(newPageNum);

                // Giữ nguyên vị trí cuộn sau khi thêm tin nhắn
                setTimeout(() => {
                    if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight - prevScrollHeight;
                    }
                }, 0);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Lỗi khi tải thêm tin nhắn:", error);
        }

        setIsFetching(false);
    };

    useEffect(() => {
        document.title = conversationResponse?.name + " | Chit Chat" || "Chit Chat";
    }, []);

    // Tải tin nhắn ban đầu khi mở chat
    useEffect(() => {
        if (!conversationResponse) return; // Nếu đã tải rồi thì không gọi lại

        setMessages([]);
        setPageNum(0);
        pageNumRef.current = 0;
        setHasMore(true);
        hasFetchedInitialMessages.current = false;

        const fetchInitialMessages = async () => {
            setIsFetching(true);
            try {
                if (conv_id) {
                    const response = await getConversationMessages(conv_id, 0);

                    if (response.result && response.result.content.length > 0) {
                        const newMessages = response.result?.content.reverse() || [];
                        setMessages(newMessages);
                        setPageNum(0);
                        setHasMore(true);
                        const lastMessages = newMessages;
                        const lastMessage = lastMessages[lastMessages.length - 1];
                        updateLastMessage(conv_id, lastMessage.senderId, lastMessage.content, lastMessage.createdAt);
                    }
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Lỗi khi tải tin nhắn ban đầu:", error);
            }
            setIsFetching(false);
            hasFetchedInitialMessages.current = true; // Đánh dấu đã tải xong
        };

        fetchInitialMessages();
        chatEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, [conv_id]);


    // Theo dõi cuộn để kiểm tra nếu kéo lên trên cùng thì tải tin nhắn cũ
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const handleScroll = () => {
            if (chatContainer.scrollTop === 0 && hasMore) {
                fetchOlderMessages();
            }
            setIsAtBottom(checkIsAtBottom());
        };

        chatContainer.addEventListener("scroll", handleScroll);
        return () => chatContainer.removeEventListener("scroll", handleScroll);
    }, [conversationResponse?.id, hasMore]);

    // Chỉ tự động cuộn xuống khi chat ở dưới cùng và có tin nhắn mới
    useEffect(() => {
        if (isAtBottom) {
            if (messages.at(messages.length)?.fileNames[0]) {
                setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
            } else {
                setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 10);
            }
        }
    }, [messages]);

    if (!user) return

    return (
        <div ref={chatContainerRef}
            className={`w-full overflow-y-auto flex flex-col ps-3 pe-2 pb-6 pt-2
                ${deviceType !== 'PC' ? 'max-h-[85dvh] min-h-[70dvh]' : 'h-full'}
                ${files && files?.length > 0 ? replyTo ? 'mb-52' : 'mb-40' : replyTo ? 'mb-32' : 'mb-12'}
                `}
        >
            {messages.map((message, i) => {
                const prevMsg = i > 0 ? messages[i - 1] : null;

                // Kiểm tra thời gian cách nhau
                let showDateSeparator = false;
                if (!prevMsg) showDateSeparator = true;
                else {
                    const prevTime = dayjs(prevMsg.createdAt);
                    const currTime = dayjs(message.createdAt);
                    const diffMinutes = currTime.diff(prevTime, "minute");

                    if (!currTime.isSame(prevTime, "day") || diffMinutes > 30) {
                        showDateSeparator = true;
                    }
                }

                const isSameSenderAsPrevious = i > 0 && messages[i - 1].senderId === message.senderId;
                const isSameSenderAsNext = i < messages.length - 1 && messages[i + 1].senderId === message.senderId;

                const isFirstInGroup = !isSameSenderAsPrevious;
                const isLastInGroup = !isSameSenderAsNext;
                const isSingleMessage = !isSameSenderAsPrevious && !isSameSenderAsNext;

                // Kiểm tra tin nhắn cuối của user hiện tại trong list
                const lastMessageByCurrentUserIndex = messages
                    .map((msg) => msg.senderId)
                    .lastIndexOf(user?.user.id);

                // Kiểm tra xem tin nhắn hiện tại có phải là tin cuối của user này không
                const isLastMessageByCurrentUser = i === lastMessageByCurrentUserIndex;

                return (
                    <div key={i} className={`${isSameSenderAsNext ? 'mb-[1px]' : 'mb-2'}`}>
                        {showDateSeparator && (
                            <div className="flex justify-center items-center w-full my-4">
                                <span className={`mx-3 text-xs font-semibold px-2
                                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                                    `}>
                                    {dayjs(message.createdAt).isSame(dayjs(), "day")
                                        ? dayjs(message.createdAt).format("HH:mm")
                                        : dayjs(message.createdAt).format("HH:mm DD/MM")}
                                </span>
                            </div>
                        )}

                        <ChatMessage message={message} isFirstInGroup={isFirstInGroup}
                            isLastInGroup={isLastInGroup} isSingleMessage={isSingleMessage}
                            isLastMessageByCurrentUser={isLastMessageByCurrentUser}
                            conversationResponse={conversationResponse}
                            participants={participants}
                            onDeleteMessage={onDeleteMessage}
                            setDisplayMediaUrl={setDisplayMediaUrl}
                            setIsDisplayMedia={setIsDisplayMedia}
                            onReply={onReply}
                        />
                    </div>
                )
            })}
            <div ref={chatEndRef} className={``} />
        </div>

    )
}

export default ChatBody

