import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import useDeviceTypeByWidth from "../../../../utilities/useDeviceTypeByWidth";


export interface MessageObject {
	text: string;
	user: string;
}

interface MessagesProps {
	messages: MessageObject[];
	name: string;
}

const ChatBody: React.FC<MessagesProps> = ({ messages, name }) => {
    const deviceType = useDeviceTypeByWidth();
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Cuộn đến cuối mỗi khi danh sách tin nhắn thay đổi
    useEffect(() => {
        // Cuộn đến cuối
        chatEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [messages]);
    
    return (
        <div className={`w-full overflow-y-auto flex flex-col bg-white px-2 pb-4
            ${ deviceType !== 'PC' ? 'max-h-[85vh] min-h-[85vh]' : 'max-h-[78vh] min-h-[78vh]'}`}>
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

