import { useState, useEffect, useRef } from "react"
import { over } from "stompjs";
import SockJS from "sockjs-client";
import ChatBody, { MessageObject } from "./ChatBody"
import ChatHeader from "./ChatHeader"
import ChatInput from "./ChatInput"
import { useTheme } from "../../../../utilities/ThemeContext"
import { ConversationResponse } from "../../../../types/Conversation"
import { useAuth } from "../../../../utilities/AuthContext"

export interface MainChatProps {
    toggleChangeWidth: () => void;
    toggleShowConversationMembersModalOpen?: () => void;
    isChangeWidth: boolean;
    conversationResponse?: ConversationResponse;
}
let socketUrl = "http://localhost:8888/ws";

const MainChat: React.FC<MainChatProps> = ({
    toggleChangeWidth, isChangeWidth,
    toggleShowConversationMembersModalOpen,
    conversationResponse
}) => {

    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<MessageObject[]>([]);
    const stompClientRef = useRef<any>(null);


    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!conversationResponse || isConnected) return;

        const socket = new SockJS(socketUrl);
        const stompClient = over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect({}, () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);

            stompClient.subscribe(`/topic/group/${conversationResponse.id}`, (message: any) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, receivedMessage]);
            });
        });

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                console.log("Disconnecting Web Socket...");
                stompClientRef.current.disconnect();
            }
        };
    }, [conversationResponse?.id]);


    const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (message.trim() && stompClientRef.current && conversationResponse) {
            const chatMessage = {
                conversationId: conversationResponse.id,
                senderId: user?.user.id,
                recipientId: conversationResponse.participantIds,
                content: message
            };

            stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };


    return (
        <div className={`min-h-[96vh] flex flex-col items-center pe-1 pt-1 pb-0 
            rounded-xl shadow-sm overflow-hidden
            ${isDarkMode ? 'bg-black ' : 'bg-[#FF9E3B]'}`}>

            {!conversationResponse ? (
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
            ) : (
                <>
                    <ChatHeader
                        toggleChangeWidth={toggleChangeWidth}
                        isChangeWidth={isChangeWidth}
                        toggleShowConversationMembersModalOpen={toggleShowConversationMembersModalOpen}
                        conversationResponse={conversationResponse}
                    />
                    <div className="flex flex-col items-center justify-center w-full max-h-[87vh] min-h-[87vh] overflow-hidden">
                        <ChatBody messages={messages} />
                        <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
                    </div>
                </>
            )}
        </div>
    );

}

export default MainChat

