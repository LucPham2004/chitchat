import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import useDeviceTypeByWidth from "../../../../utilities/useDeviceTypeByWidth";
import { useTheme } from "../../../../utilities/ThemeContext";


export interface MessageObject {
    senderId: number;
    text: string;
    name: string;
}

interface MessagesProps {
    messages: MessageObject[];
}

const ChatBody: React.FC<MessagesProps> = ({ messages }) => {
    const { isDarkMode } = useTheme();
    const deviceType = useDeviceTypeByWidth();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const currentUser = {
        id: 5,

    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [messages]);

    return (
        <div
            className={`w-full overflow-y-auto flex flex-col ps-3 pe-2 pb-4
                ${deviceType !== 'PC' ? 'max-h-[85vh] min-h-[50vh]' : 'max-h-[78vh] min-h-[78vh]'}
                bg-cover bg-center`}
            style={{
                backgroundImage: `url(${isDarkMode ? '/convBgDark.jpg' : '/convBg.jpg'})`,
            }}
        >
            {messages.map((message, i) => {
                const isSameSenderAsPrevious = i > 0 && messages[i - 1].senderId === message.senderId;
                const isSameSenderAsNext = i < messages.length - 1 && messages[i + 1].senderId === message.senderId;

                const isFirstInGroup = !isSameSenderAsPrevious;
                const isLastInGroup = !isSameSenderAsNext;
                const isSingleMessage = !isSameSenderAsPrevious && !isSameSenderAsNext;

                // Kiểm tra tin nhắn cuối của user hiện tại trong list
                const lastMessageByCurrentUserIndex = messages
                    .map((msg) => msg.senderId)
                    .lastIndexOf(currentUser.id);

                // Kiểm tra xem tin nhắn hiện tại có phải là tin cuối của user này không
                const isLastMessageByCurrentUser = i === lastMessageByCurrentUserIndex;

                return (
                    <div key={i} className={`${isSameSenderAsNext ? 'mb-[1px]' : 'mb-2'}`}>
                        <ChatMessage message={message} isFirstInGroup={isFirstInGroup}
                            isLastInGroup={isLastInGroup} isSingleMessage={isSingleMessage}
                            isLastMessageByCurrentUser={isLastMessageByCurrentUser} />
                    </div>
                )
            })}
            <div ref={chatEndRef} />
        </div>

    )
}

export default ChatBody

