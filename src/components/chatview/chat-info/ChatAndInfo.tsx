import { useEffect, useState } from "react";
import ConversationInfo from "./conversationInfo/ConversationInfo";
import MainChat from "./mainchat/MainChat";
import { ChangeWidthProps } from "../../../views/ChatView";
import Modal from "../../common/Modal";
import ChatMessage from "./mainchat/ChatMessage";
import EmojiPicker from "emoji-picker-react";
import ParticipantCard from "./conversationInfo/ParticipantCard";
import { useParams } from "react-router-dom";
import useDeviceTypeByWidth from "../../../utilities/DeviceType";
import { useTheme } from "../../../utilities/ThemeContext";
import { useAuth } from "../../../utilities/AuthContext";
import { getConversationById, getParticipantsByConvId, updateConversationPartially } from "../../../services/ConversationService";
import { ConversationResponse } from "../../../types/Conversation";
import { ChatParticipants } from "../../../types/User";
import { useChatContext } from "../../../utilities/ChatContext";
import toast, { Toaster } from "react-hot-toast";



const ChatAndInfo: React.FC<ChangeWidthProps> = ({ toggleChangeWidth, isChangeWidth }) => {
    const { user } = useAuth();
    const { conv_id } = useParams();
    const [Conversation, setConversation] = useState<ConversationResponse | undefined>();
    const [Participants, setParticipants] = useState<ChatParticipants[] | undefined>();
    const deviceType = useDeviceTypeByWidth();
    const { isDarkMode } = useTheme();
    
    const {setIsDisplayMedia} = useChatContext();
    const {setDisplayMediaUrl} = useChatContext();

    const [isPinnedMessageModalOpen, setIsPinnedMessageModalOpen] = useState(false);
    const togglePinnedMessageModalOpen = () => setIsPinnedMessageModalOpen(!isPinnedMessageModalOpen);

    const [isChangeConversationNameModalOpen, setIsChangeConversationNameModalOpen] = useState(false);
    const toggleChangeConversationNameModalOpen = () => setIsChangeConversationNameModalOpen(!isChangeConversationNameModalOpen);

    const [isChangeConversationEmojiModalOpen, setIsChangeConversationEmojiModalOpen] = useState(false);
    const toggleChangeConversationEmojiModalOpen = () => setIsChangeConversationEmojiModalOpen(!isChangeConversationEmojiModalOpen);

    const [isShowConversationMembersModalOpen, setIsShowConversationMembersModalOpen] = useState(false);
    const toggleShowConversationMembersModalOpen = () => setIsShowConversationMembersModalOpen(!isShowConversationMembersModalOpen);

    const [inputValue, setInputValue] = useState('');
    const [charCount, setCharCount] = useState<number>(0);


    const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);

    const toggleUserMenu = (participantId: string) => {
        setSelectedParticipantId(prev => (prev === participantId ? null : participantId));
    };

    const pinnedMessages: any[] = [];

    useEffect(() => {
        setConversation(undefined);

        const fetchConversation = async () => {
            try {
                if (conv_id && user?.user.id) {
                    const response = await getConversationById(conv_id, user?.user.id);
                    const participants = await getParticipantsByConvId(conv_id);
                    if (response.result) {
                        setConversation(response.result);
                        setParticipants(participants.result);
                    } else {
                        throw new Error("Conversation response result is undefined");
                    }
                } else {
                    throw new Error("Conversation ID is undefined");
                }
            } catch (error) {

            }
        };

        fetchConversation();
    }, [conv_id]);

    useEffect(() => {
        document.title = Conversation?.name + " | Chit Chat" || "Chit Chat";
    }, []);

    const handleEmojiSelect = async (emoji: string) => {
        try {
            if (conv_id && user?.user.id) {
                const response = await updateConversationPartially({ emoji }, conv_id, user?.user.id);
                if(response.code == 1000) {
                    toast.success("Cập nhật emoji thành công!");
                    window.location.reload();
                }
                setIsChangeConversationEmojiModalOpen(false);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật emoji đoạn chat:", error);
        }
    };

    const showToast = (content: string, status: string) => {
        if(status == 'success') {
            toast.success(content);
        } else {
            toast.error(content);
        }
    }

    return (
        <div className={`${deviceType !== 'Mobile' ? 'max-h-[96dvh] min-h-[96dvh] rounded-xl' : 'h-full'} relative w-full flex flex-row items-center 
            pb-0 `}>
                
            {/* 🔔 Toast */}
            <Toaster position="top-center" toastOptions={{
                style: {
                background: "#fff",
                color: "#333",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                },
            }} />

            {!(deviceType == 'Mobile' && isChangeWidth) && (
                <div className={`transition-all duration-100 
                    ${deviceType !== 'PC'
                        ? isChangeWidth ? 'w-0' : 'w-full'
                        : isChangeWidth ? 'w-full' : 'w-[66%] me-4'
                    }`}>
                    <MainChat
                        toggleChangeWidth={toggleChangeWidth}
                        isChangeWidth={isChangeWidth}
                        toggleShowConversationMembersModalOpen={toggleShowConversationMembersModalOpen}
                        conversationResponse={Conversation}
                        participants={Participants}
                        showToast={showToast}
                    />
                </div>
            )}
            <div className={`transition-all duration-100 
                ${deviceType !== 'PC'
                    ? isChangeWidth ? 'w-full' : 'w-0'
                    : isChangeWidth ? 'w-0' : 'w-[33%]'
                }`}>
                <ConversationInfo
                    togglePinnedMessageModalOpen={togglePinnedMessageModalOpen}
                    toggleChangeConversationNameModalOpen={toggleChangeConversationNameModalOpen}
                    toggleChangeConversationEmojiModalOpen={toggleChangeConversationEmojiModalOpen}
                    toggleChangeWidth={toggleChangeWidth}
                    conversationResponse={Conversation}
                    participants={Participants}
                />
            </div>

            {/* Pinned Messages Modal */}
            {/* <Modal isOpen={isPinnedMessageModalOpen} onClose={() => setIsPinnedMessageModalOpen(false)}>
                <h2 className="text-lg font-bold mb-3">Tin nhắn đã ghim</h2>
                {pinnedMessages.length > 0 ? (
                    <div className="flex flex-col items-start justify-start w-full overflow-y-auto">
                        {pinnedMessages.map((message, i) => {
                            const isSameSenderAsPrevious = i > 0 && pinnedMessages[i - 1].senderId === message.senderId;
                            const isSameSenderAsNext = i < pinnedMessages.length - 1 && pinnedMessages[i + 1].senderId === message.senderId;

                            const isFirstInGroup = !isSameSenderAsPrevious;
                            const isLastInGroup = !isSameSenderAsNext;
                            const isSingleMessage = !isSameSenderAsPrevious && !isSameSenderAsNext;

                            return (
                                <div key={i} className="flex flex-col p-1 items-start justify-start w-full">
                                    <p className="text-xs flex self-end">{message.timestamp}</p>
                                    <div key={i} className="p-2 pt-0 mb-1 w-fit">
                                        <ChatMessage message={[]}
                                            isFirstInGroup={isFirstInGroup} 
                                            isLastInGroup={isLastInGroup} 
                                            isSingleMessage={isSingleMessage} 
                                            setDisplayMediaUrl={setDisplayMediaUrl}
                                            setIsDisplayMedia={setIsDisplayMedia}/>
                                    </div>
                                    <hr className="w-full"></hr>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 items-center justify-center px-16 py-40 w-max">
                        <img alt="no pinned message" src="/images/noPinnedImg.png" className="w-54 h-36" />
                        <p className="text-base font-semibold">Chưa ghim tin nhắn nào</p>
                        <p className="text-gray-400 text-sm">Các tin nhắn được ghim trong đoạn chat này sẽ hiển thị ở đây</p>
                    </div>)}
            </Modal> */}

            {/* Change Conversation Name Modal */}
            <Modal isOpen={isChangeConversationNameModalOpen} onClose={() => {
                setIsChangeConversationNameModalOpen(false)
                setInputValue('');
                setCharCount(0);
            }}>
                <h2 className="text-lg font-bold mb-3">Đổi tên đoạn chat</h2>
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Mọi người đều biết khi đổi tên nhóm chat thay đổi.</p>
                    <div className="relative w-full">
                        <div className="absolute flex flex-row justify-between items-center w-full p-2">
                            <p className="text-blue-600 text-xs">Tên đoạn chat</p>
                            <p className={`text-xs ${charCount > 255 ? 'text-red-500' : 'text-gray-500'}`}>{charCount} / 255</p>
                        </div>
                        <input type="text" className={`w-full p-2 pt-8 border border-gray-200 rounded-lg 
                            focus:border-blue-500 ${isDarkMode ? 'text-gray-300 bg-[#3C3C3C]' : 'text-gray-600 bg-white'}`} placeholder={Conversation?.name}
                            value={inputValue}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 255) {
                                    setInputValue(value);
                                    setCharCount(value.length);
                                }
                            }} />
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-2 w-full">
                        <button className={`flex items-center justify-center gap-2 w-full p-1 text-md font-medium rounded-lg 
                            ${isDarkMode ? 'text-gray-200 bg-[#555555] hover:bg-[#5A5A5A]'
                                : 'text-gray-800 bg-gray-200 hover:bg-gray-300'}`}
                            onClick={() => setIsChangeConversationNameModalOpen(false)}>
                            Huỷ
                        </button>
                        <button className={`flex items-center justify-center gap-2 w-full p-1 text-md font-medium rounded-lg 
                            ${isDarkMode ? 'text-gray-200 bg-[#555555] hover:bg-[#5A5A5A]'
                                : 'text-gray-800 bg-gray-200 hover:bg-gray-300'}
                            ${charCount < 1 ? 'cursor-not-allowed' : ''}`}
                            onClick={async () => {
                                if (charCount < 1) return;
                                try {
                                    if (conv_id && user?.user.id) {
                                        const response = await updateConversationPartially({ name: inputValue }, conv_id, user?.user.id);
                                        console.log(response);
                                        if(response.code == 1000) {
                                            toast.success("Cập nhật tên đoạn chat thành công!");
                                            window.location.reload();
                                        }
                                        setIsChangeConversationNameModalOpen(false);
                                        setInputValue('');
                                        setCharCount(0);
                                    }
                                } catch (error) {
                                    console.error("Lỗi khi cập nhật tên đoạn chat:", error);
                                }
                            }}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Change Chat Emoji Modal */}
            <Modal isOpen={isChangeConversationEmojiModalOpen} onClose={() => setIsChangeConversationEmojiModalOpen(false)}>
                <h2 className="text-lg font-bold mb-3">Biểu tượng cảm xúc</h2>
                <div className="flex flex-col items-start justify-start w-full">
                    <EmojiPicker width={420} height={420} onEmojiClick={(e) => handleEmojiSelect(e.emoji)} />
                </div>
            </Modal>

            {/* Show Conversation members Modal */}
            <Modal isOpen={isShowConversationMembersModalOpen} onClose={() => setIsShowConversationMembersModalOpen(false)}>
                <h2 className="text-lg font-bold mb-3">Thành viên</h2>
                <div className="relative flex flex-col w-full">
                    {Participants?.map((participant) => (
                        <div key={participant.id}>
                            <ParticipantCard 
                                id={participant.id}
                                avatar={participant.avatarUrl}
                                name={participant.firstName + " " + `${participant.lastName ? participant.lastName : ''}`}
                                toggleUserMenu={toggleUserMenu} 
                                selectedParticipantId={selectedParticipantId}                            />
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

export default ChatAndInfo;

