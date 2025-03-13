import { useState, useEffect, useRef } from "react"
import ChatBody from "./ChatBody"
import { Stomp } from "@stomp/stompjs";
import ChatHeader from "./ChatHeader"
import ChatInput from "./ChatInput"
import { useTheme } from "../../../../utilities/ThemeContext"
import { ConversationResponse } from "../../../../types/Conversation"
import { useAuth } from "../../../../utilities/AuthContext"
import { ChatResponse } from "../../../../types/Message";
import { useParams } from "react-router-dom";
import { useChatContext } from "../../../../utilities/ChatContext";

export interface MainChatProps {
    toggleChangeWidth: () => void;
    toggleShowConversationMembersModalOpen?: () => void;
    isChangeWidth: boolean;
    conversationResponse?: ConversationResponse;
}

const MainChat: React.FC<MainChatProps> = ({
    toggleChangeWidth, isChangeWidth,
    toggleShowConversationMembersModalOpen,
    conversationResponse
}) => {

    const { user } = useAuth();
    const { conv_id } = useParams();
    const { isDarkMode } = useTheme();
    const { updateLastMessage } = useChatContext();
    
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatResponse[]>([]);
    const stompClientRef = useRef<any>(null);

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!conversationResponse || !conv_id) return;
    
        // Ngắt kết nối WebSocket cũ nếu có
        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log("Disconnecting WebSocket...");
            stompClientRef.current.disconnect();
            setIsConnected(false);
        }
    
        // Tạo một kết nối WebSocket mới
        const stompClient = Stomp.client("ws://localhost:8888/chat-service/ws");
        stompClientRef.current = stompClient;
    
        stompClient.connect({}, (frame: any) => {
            console.log("Connected to WebSocket", frame);
            setIsConnected(true);
    
            // Lắng nghe tin nhắn của cuộc trò chuyện mới
            stompClient.subscribe(`/topic/conversation/${conv_id}`, (message: any) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, receivedMessage]);

                updateLastMessage(conv_id, receivedMessage.senderId, receivedMessage.content, new Date().toISOString());
            });
        }, (error: any) => {
            console.error("WebSocket connection failed: ", error);
        });
    
        return () => {
            // Ngắt kết nối khi component unmount
            if (stompClientRef.current && stompClientRef.current.connected) {
                console.log("Disconnecting WebSocket...");
                stompClientRef.current.disconnect();
                setIsConnected(false);
            }
        };
    }, [conversationResponse?.id, conv_id]); // Lắng nghe sự thay đổi của `conv_id`
    


    const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (message.trim() && stompClientRef.current && conversationResponse) {
            const chatMessage = {
                conversationId: conv_id,
                senderId: user?.user.id,
                recipientId: conversationResponse.participantIds,
                content: message
            };

            stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessage('');

            if(conv_id && user?.user.id) {
                updateLastMessage(conv_id, user?.user.id, message, new Date().toISOString());
            }
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
                    <div 
                        className="flex flex-col items-center justify-center w-full max-h-[87vh] min-h-[87vh] overflow-hidden"
                        >
                        <ChatBody messages={messages} setMessages={setMessages} conversationResponse={conversationResponse} />
                        <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
                    </div>
                </>
            )}
        </div>
    );

}

export default MainChat

