import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage"


export interface MessageObject {
	text: string;
	user: string;
}

interface MessagesProps {
	messages: MessageObject[];
	name: string;
}

const ChatBody: React.FC<MessagesProps> = ({ messages, name }) => {

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Cuộn đến cuối mỗi khi danh sách tin nhắn thay đổi
    useEffect(() => {
        // Cuộn đến cuối
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    return (
        <div className="w-full min-h-[78vh] max-h-[78vh] overflow-y-auto flex flex-col bg-white px-2 pb-4">
            {messages.map((message, i) => (
                <div key={i} className="p-1">
                    <ChatMessage message={message} name={name} />
                </div>
            ))}
            <div ref={chatEndRef} />
        </div>
    )
}

export default ChatBody

