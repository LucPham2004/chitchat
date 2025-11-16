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
import useDeviceTypeByWidth from "../../../../utilities/DeviceType";
import { unblockUser } from "../../../../services/FriendshipService";
import { ShieldOff, Unlock, AlertCircle } from "lucide-react";

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
    const deviceType = useDeviceTypeByWidth();

    const {
        sendMessage: sendWebSocketMessage,
        currentNewMessage,
        isConnected
    } = useChatContext();

    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatResponse[]>([]);
    const [replyTo, setReplyTo] = useState<ChatResponse | null>(null);
    const [files, setFiles] = useState<File[]>([]);


    const handleUnblockUser = async () => {
        if (!user) return;

        const isConfirm = window.confirm(
            `Bạn có chắc muốn bỏ chặn người này không?`
        );

        if (!isConfirm) return;
        try {
            const targetParticipant = participants?.find(participant => participant.id !== user.user.id);
            if (!targetParticipant) {
                return;
            }
            const data = await unblockUser(user.user.id, targetParticipant.id);
            if (data?.code == 1000) {
                console.log("User unblocked:", data.result);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
    };

    useEffect(() => {
        document.title = conversationResponse?.name + " | Chit Chat" || "Chit Chat";
    }, []);

    useEffect(() => {
        setMessages([]);
        setFiles([]);
        setReplyTo(null);
    }, [conv_id]);

    useEffect(() => {
        if (!user?.user.id) return;

        if (currentNewMessage && currentNewMessage.conversationId === conv_id) {
            setMessages(prev => [...prev, currentNewMessage]);
        }

    }, [conv_id, currentNewMessage]);

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
                    resourceTypes: uploadedResourceTypes,
                    replyToId: replyTo?.id || null,
                };

                if (!message && uploadedPublicIds.length === 0 && uploadedUrls.length === 0) return;

                const success = sendWebSocketMessage(chatMessage);
                if (success) {
                    setMessage('');
                    setFiles([]);
                    setReplyTo(null);
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
            <div
                className={`min-h-[96dvh] max-h-[96dvh] w-full flex flex-col 
                pb-0 rounded-xl shadow-sm overflow-hidden bg-cover bg-center`}
                style={{
                    backgroundImage: `url(${isDarkMode ? '/images/sky-dark.jpg' : '/images/sky-bg.jpg'})`,
                }}
            >
                {/* Header Skeleton */}
                <div className="w-full h-16 flex items-center gap-3 px-4 bg-black/20 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full bg-gray-500/40 animate-pulse"></div>
                    <div className="flex flex-col gap-1">
                        <div className="w-32 h-3 bg-gray-500/40 rounded animate-pulse"></div>
                        <div className="w-16 h-3 bg-gray-500/30 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Body Placeholder */}
                <div className="flex-1 w-full px-4 py-3 flex flex-col gap-4 overflow-hidden">
                </div>

                {/* Input Placeholder */}
                <div className="w-full h-16 bg-black/20 backdrop-blur-sm px-4 flex items-center">
                    <div className="w-full h-10 rounded-xl bg-gray-500/30 animate-pulse"></div>
                </div>
            </div>
        ) : (
            <div className={` flex flex-col items-center justify-center  
                 shadow-sm bg-cover bg-center 
                ${deviceType == 'Mobile' ? 'min-h-[100dvh] max-h-[100dvh]' : 'min-h-[96dvh] rounded-xl'}
                ${isDarkMode ? ' border border-gray-900' : ''}
                `}
                style={{
                    backgroundImage: `url(${isDarkMode ? '/images/sky-dark.jpg' : '/images/sky-bg.jpg'})`,
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}>
                <>
                    <ChatHeader
                        toggleChangeWidth={toggleChangeWidth}
                        isChangeWidth={isChangeWidth}
                        toggleShowConversationMembersModalOpen={toggleShowConversationMembersModalOpen}
                        conversationResponse={conversationResponse}
                    />
                    <div className={`relative flex flex-col items-center justify-between w-full 
                        ${deviceType == 'Mobile' ? 'max-h-[91dvh] min-h-[91dvh] ' : 'max-h-[87dvh] min-h-[87dvh] '}`}>
                        <ChatBody
                            messages={messages}
                            setMessages={setMessages}
                            conversationResponse={conversationResponse}
                            participants={participants}
                            files={files}
                            onDeleteMessage={handleDeleteMessage}
                            replyTo={replyTo}
                            onReply={setReplyTo}
                        />
                        {conversationResponse.blocked ? (
                            <div className={`absolute inset-x-0 bottom-0 border-t backdrop-blur-sm transition-all duration-300 rounded-b-xl
                                ${isDarkMode
                                    ? 'bg-gradient-to-t from-red-950/95 to-red-900/90 border-red-800/50'
                                    : 'bg-gradient-to-t from-red-50/95 to-red-100/90 border-red-200/50'
                                }`}>
                                <div className="relative overflow-hidden">
                                    {/* Decorative gradient overlay */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${isDarkMode
                                            ? 'bg-gradient-to-r from-transparent via-red-500/50 to-transparent'
                                            : 'bg-gradient-to-r from-transparent via-red-400/50 to-transparent'
                                        }`} />

                                    <div className="px-6 py-5">
                                        {conversationResponse.blockerId === user?.user.id ? (
                                            <div className="flex justify-center gap-6 items-center text-center ">
                                                {/* Icon với animation */}
                                                <div className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'
                                                    }`}>
                                                    <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isDarkMode ? 'bg-red-500' : 'bg-red-400'
                                                        }`} />
                                                    <ShieldOff className={`relative z-10 ${isDarkMode ? 'text-red-400' : 'text-red-600'
                                                        }`} size={32} />
                                                </div>

                                                {/* Message */}
                                                <div className="space-y-2">
                                                    <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-700'
                                                        }`}>
                                                        Cuộc trò chuyện đã bị chặn
                                                    </h3>
                                                    <p className={`text-xs ${isDarkMode ? 'text-red-400/80' : 'text-red-600/80'
                                                        }`}>
                                                        Bạn đã chặn cuộc trò chuyện này. Bỏ chặn để tiếp tục nhắn tin.
                                                    </p>
                                                </div>

                                                {/* Button */}
                                                <button
                                                    onClick={handleUnblockUser}
                                                    className={`group relative inline-flex items-center gap-2 px-2 pt-1 pb-1.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${isDarkMode
                                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/30'
                                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-600/30'
                                                        }`}
                                                >
                                                    <Unlock size={18} className="transition-transform group-hover:rotate-12" />
                                                    <span>Bỏ chặn</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-center space-y-4">
                                                {/* Icon */}
                                                <div className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'
                                                    }`}>
                                                    <AlertCircle className={`${isDarkMode ? 'text-red-400' : 'text-red-600'
                                                        }`} size={32} />
                                                </div>

                                                {/* Message */}
                                                <div className="space-y-2 max-w-md">
                                                    <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-700'
                                                        }`}>
                                                        Không thể gửi tin nhắn
                                                    </h3>
                                                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-red-400/80' : 'text-red-600/80'
                                                        }`}>
                                                        Bạn không thể gửi tin nhắn vì đã bị người này chặn. Họ sẽ không nhận được tin nhắn từ bạn.
                                                    </p>
                                                </div>

                                                {/* Decorative element */}
                                                <div className={`h-px w-32 ${isDarkMode
                                                        ? 'bg-gradient-to-r from-transparent via-red-500/30 to-transparent'
                                                        : 'bg-gradient-to-r from-transparent via-red-400/30 to-transparent'
                                                    }`} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage}
                                files={files} setFiles={setFiles} emoji={conversationResponse.emoji}
                                participants={participants}
                                replyTo={replyTo}
                                setReplyTo={setReplyTo}
                            />
                        )}
                    </div>
                </>
            </div>
        )
    );

}

export default MainChat

