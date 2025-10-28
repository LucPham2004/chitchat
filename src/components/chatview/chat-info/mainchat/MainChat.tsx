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
import { deleteImage, uploadConversationImage, uploadFile } from "../../../../services/ImageService";
import { uploadConversationVideo } from "../../../../services/VideoService";
import { ChatParticipants } from "../../../../types/User";

export interface MainChatProps {
    toggleChangeWidth: () => void;
    toggleShowConversationMembersModalOpen?: () => void;
    isChangeWidth: boolean;
    conversationResponse?: ConversationResponse;
    participants?: ChatParticipants[];
}

const MainChat: React.FC<MainChatProps> = ({
    toggleChangeWidth, isChangeWidth,
    toggleShowConversationMembersModalOpen,
    conversationResponse,
    participants
}) => {

    const { user } = useAuth();
    const { conv_id } = useParams();
    const { isDarkMode } = useTheme();

    const { 
        sendMessage: sendWebSocketMessage, 
        subscribeToConversation, 
        isConnected
    } = useChatContext();

    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatResponse[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    const isVideoUrl = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
        return videoExtensions.some(ext => url.toLowerCase().includes(ext));
    };

    useEffect(() => {
        document.title = conversationResponse?.name + " | Chit Chat" || "Chit Chat";
    }, []);

    useEffect(() => {
        setMessages([]);
    }, [conv_id]);

    useEffect(() => {
        if (!user?.user.id) return;

        const unsubscribe = subscribeToConversation(user?.user.id, (receivedMessage) => {
            console.log('Message received in conversation:', receivedMessage);
            
            setMessages((prev) => [...prev, receivedMessage]);
        });

        return unsubscribe;
    }, [conv_id, subscribeToConversation]);

    const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isConnected || !conv_id) {
            alert("Kết nối WebSocket không khả dụng. Vui lòng thử lại sau.");
            return;
        }

        const uploadedPublicIds: string[] = [];
        const uploadedUrls: string[] = [];
        const uploadedFileNames: string[] = [];
        const uploadedHeights: number[] = [];
        const uploadedWidths: number[] = [];
        const uploadedResourceTypes: string[] = [];

        try {
            // File upload logic (giữ nguyên)
            for (const file of files) {
                if (file.type.endsWith("pdf")) {
                    alert("Chưa hỗ trợ định dạng file này!");
                    return;
                }
                
                let uploadResult;
                if (file.type.startsWith("video")) {
                    uploadResult = await uploadConversationVideo(file, conv_id);
                    uploadedHeights.push(uploadResult.height);
                    uploadedWidths.push(uploadResult.width);
                } else if (file.type.startsWith("image")) {
                    uploadResult = await uploadConversationImage(file, conv_id);
                    uploadedHeights.push(uploadResult.height);
                    uploadedWidths.push(uploadResult.width);
                } else {
                    uploadResult = await uploadFile(file, conv_id);
                    uploadedHeights.push(5);
                    uploadedWidths.push(3);
                }

                uploadedPublicIds.push(uploadResult.public_id);
                uploadedUrls.push(uploadResult.secure_url);
                uploadedFileNames.push(uploadResult.original_filename);
                uploadedResourceTypes.push(uploadResult.resource_type);
            }

            if ((message.trim() || files.length > 0) && conversationResponse) {
                const chatMessage = {
                    conversationId: conv_id,
                    senderId: user?.user.id,
                    recipientId: conversationResponse.participantIds,
                    content: message,
                    publicIds: uploadedPublicIds,
                    urls: uploadedUrls,
                    fileNames: uploadedFileNames,
                    heights: uploadedHeights,
                    widths: uploadedWidths,
                    resourceTypes: uploadedResourceTypes
                };

                if (!message && uploadedPublicIds.length === 0 && uploadedUrls.length === 0) return;

                const success = sendWebSocketMessage(chatMessage);
                if (success) {
                    setMessage('');
                    setFiles([]);
                } else {
                    alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert("Có lỗi xảy ra khi gửi tin nhắn.");
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
    };

    return (
        !conversationResponse ? (
            <div className={`min-h-[96vh] max-h-[96vh]  w-full flex items-center justify-center
                    pb-0 rounded-xl shadow-sm overflow-y-auto
                    `}
                >
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
            </div>
        ) : (
            <div className={`min-h-[96vh] flex flex-col items-center justify-center pe-1 pt-1 pb-0 
                rounded-xl shadow-sm bg-cover bg-center
                `}
                style={{
                    backgroundImage: `url(${isDarkMode ? '/sky-dark.jpg' : '/sky-bg.jpg'})`,
                }}>
                <>
                    <ChatHeader
                        toggleChangeWidth={toggleChangeWidth}
                        isChangeWidth={isChangeWidth}
                        toggleShowConversationMembersModalOpen={toggleShowConversationMembersModalOpen}
                        conversationResponse={conversationResponse}
                    />
                    <div className="relative flex flex-col items-center justify-start w-full 
                        max-h-[87vh] min-h-[87vh] ">
                        <ChatBody
                            messages={messages}
                            setMessages={setMessages}
                            conversationResponse={conversationResponse}
                            participants={participants}
                            files={files}
                            onDeleteMessage={handleDeleteMessage}
                        />
                        <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage}
                            files={files} setFiles={setFiles} emoji={conversationResponse.emoji} />
                    </div>
                </>
            </div>
        )
    );

}

export default MainChat

