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
import { deleteImage, uploadConversationImage } from "../../../../services/ImageService";
import { uploadConversationVideo } from "../../../../services/VideoService";

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
    const [files, setFiles] = useState<File[]>([]);
    const stompClientRef = useRef<any>(null);

    const isVideoUrl = (url: string): boolean => {
		const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
		return videoExtensions.some(ext => url.toLowerCase().includes(ext));
	};

    useEffect(() => {
        document.title = conversationResponse?.name + " | Chit Chat" || "Chit Chat";
    }, []);

    useEffect(() => {
        if (!conversationResponse || !conv_id) return;

        // Ngắt kết nối WebSocket cũ nếu có
        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log("Disconnecting WebSocket...");
            stompClientRef.current.disconnect();
        }

        // Tạo một kết nối WebSocket mới
        const stompClient = Stomp.client("ws://localhost:8888/chat-service/ws");
        stompClientRef.current = stompClient;

        stompClient.connect({}, (frame: any) => {
            console.log("Connected to WebSocket", frame);

            // Lắng nghe tin nhắn của cuộc trò chuyện mới
            stompClient.subscribe(`/topic/conversation/${conv_id}`, (message: any) => {
                const receivedMessage = JSON.parse(message.body);
                console.log(receivedMessage)
                setMessages((prev) => [...prev, receivedMessage]);

                if(receivedMessage.urls.length > 0) {
                    updateLastMessage(conv_id, receivedMessage.senderId, `${receivedMessage.senderId == user?.user.id ? "Bạn" : conversationResponse.name}` + " đã gửi một " + `${isVideoUrl(receivedMessage.urls[receivedMessage.urls.length - 1]) ? "video" : "ảnh"}`, new Date().toISOString());
                } else {
                    updateLastMessage(conv_id, receivedMessage.senderId, `${receivedMessage.senderId == user?.user.id ? "Bạn: " + receivedMessage.content : receivedMessage.content}`, new Date().toISOString());
                }
            });
        }, (error: any) => {
            console.error("WebSocket connection failed: ", error);
        });

        return () => {
            // Ngắt kết nối khi component unmount
            if (stompClientRef.current && stompClientRef.current.connected) {
                console.log("Disconnecting WebSocket...");
                stompClientRef.current.disconnect();
            }
        };
    }, [conversationResponse?.id, conv_id]); // Lắng nghe sự thay đổi của `conv_id`



    const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const uploadedPublicIds: string[] = [];
        const uploadedUrls: string[] = [];
        const uploadedHeights: number[] = [];
        const uploadedWidths: number[] = [];
        const uploadedResourceTypes: string[] = [];

        try {
            for (const file of files) {
                if(file.type.startsWith("video")) {
                    const uploadResult = await uploadConversationVideo(file, Number(conv_id));
                    uploadedPublicIds.push(uploadResult.public_id);
                    uploadedUrls.push(uploadResult.secure_url);
                    uploadedHeights.push(uploadResult.height);
                    uploadedWidths.push(uploadResult.width);
                    uploadedResourceTypes.push(uploadResult.resource_type);
                }
                if(file.type.startsWith("image")) {
                    const uploadResult = await uploadConversationImage(file, Number(conv_id));
                    uploadedPublicIds.push(uploadResult.public_id);
                    uploadedUrls.push(uploadResult.secure_url);
                    uploadedHeights.push(uploadResult.height);
                    uploadedWidths.push(uploadResult.width);
                    uploadedResourceTypes.push(uploadResult.resource_type);
                }
            }

            if ((message.trim() || files.length > 0) && stompClientRef.current && conversationResponse) {
                const chatMessage = {
                    conversationId: conv_id,
                    senderId: user?.user.id,
                    recipientId: conversationResponse.participantIds,
                    content: message,
                    publicIds: uploadedPublicIds,
                    urls: uploadedUrls,
                    heights: uploadedHeights,
                    widths: uploadedWidths,
                    resourceTypes: uploadedResourceTypes
                };

                if(!message && uploadedPublicIds.length == 0 && uploadedUrls.length == 0) return;

                stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
                setMessage('');
                setFiles([]);
            }
         } catch (error) {
                console.error('Error creating post:', error);
            }
        };


        return (
            !conversationResponse ? (
                <div className={`min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex items-center justify-center
                    pb-0 rounded-xl border shadow-sm overflow-y-auto
                    ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
                </div>
            ) : (
            <div className={`min-h-[96vh] flex flex-col items-center justify-center pe-1 pt-1 pb-0 
                rounded-xl shadow-sm overflow-hidden
                ${isDarkMode ? 'bg-black ' : 'bg-[#FF9E3B]'}`}>
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
                        <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage}
                            files={files} setFiles={setFiles} emoji={conversationResponse.emoji}/>
                    </div>
                </>
            </div>
            )
        );

    }

    export default MainChat

