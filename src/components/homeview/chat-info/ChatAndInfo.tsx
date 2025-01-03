import { useState } from "react";
import ConversationInfo from "./conversationInfo/ConversationInfo";
import MainChat from "./mainchat/MainChat";
import { ChangeWidthProps } from "../../../views/HomeView";
import Modal from "../../modals/Modal";
import { pinnedMessagesData } from "../../../FakeData";
import ChatMessage from "./mainchat/ChatMessage";
import EmojiPicker from "emoji-picker-react";


export interface PinnedMessageModalOpenProps {
    togglePinnedMessageModalOpen: () => void;
    toggleChangeConversationNameModalOpen: () => void;
    toggleChangeConversationEmojiModalOpen: () => void;
}

const ChatAndInfo: React.FC<ChangeWidthProps> = ({ toggleChangeWidth, isChangeWidth }) => {
    const [isPinnedMessageModalOpen, setIsPinnedMessageModalOpen] = useState(false);
    const togglePinnedMessageModalOpen = () => setIsPinnedMessageModalOpen(!isPinnedMessageModalOpen);

    const [isChangeConversationNameModalOpen, setIsChangeConversationNameModalOpen] = useState(false);
    const toggleChangeConversationNameModalOpen = () => setIsChangeConversationNameModalOpen(!isChangeConversationNameModalOpen);

    const [isChangeConversationEmojiModalOpen, setIsChangeConversationEmojiModalOpen] = useState(false);
    const toggleChangeConversationEmojiModalOpen = () => setIsChangeConversationEmojiModalOpen(!isChangeConversationEmojiModalOpen);

    const [inputValue, setInputValue] = useState('');
    const [charCount, setCharCount] = useState<number>(0);


    const pinnedMessages = pinnedMessagesData;

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex flex-row items-center bg-gray-100
            pb-0">
            <div className={`transition-all duration-100 ${isChangeWidth ? 'w-full me-0' : 'w-[66%] me-4'}`}>
                <MainChat toggleChangeWidth={toggleChangeWidth} isChangeWidth={isChangeWidth} />
            </div>
            <div className={`transition-all duration-100 ${isChangeWidth ? 'w-0' : 'w-[33%]'}`}>
                <ConversationInfo 
                    togglePinnedMessageModalOpen={togglePinnedMessageModalOpen}
                    toggleChangeConversationNameModalOpen={toggleChangeConversationNameModalOpen}
                    toggleChangeConversationEmojiModalOpen={toggleChangeConversationEmojiModalOpen}/>
            </div>

            {/* Pinned Messages Modal */}
            <Modal isOpen={isPinnedMessageModalOpen} onClose={() => setIsPinnedMessageModalOpen(false)}>
                <h2 className="text-lg font-bold mb-3">Tin nhắn đã ghim</h2>
                {pinnedMessages.length > 0 ? (
                <div className="flex flex-col items-start justify-start w-full overflow-y-auto">
                    {pinnedMessages.map((message, index) => (
                        <div key={index} className="flex flex-col p-1 items-start justify-start w-full">
                            <p className="text-xs flex self-end">{message.timestamp}</p>
                            <div key={index} className="p-2 pt-0 mb-1 w-fit">
                                <ChatMessage message={{ user: message.user, text: message.message }} name={message.name} />
                            </div>
                            <hr className="w-full"></hr>
                        </div>
                    ))}
                </div>
                ) :(
                <div className="flex flex-col gap-2 items-center justify-center px-16 py-40 w-max">
                    <img alt="no pinned message" src="/noPinnedImg.png" className="w-54 h-36"/>
                    <p className="text-base font-semibold">Chưa ghim tin nhắn nào</p>
                    <p className="text-gray-600 text-sm">Các tin nhắn được ghim trong đoạn chat này sẽ hiển thị ở đây</p>
                </div>)}
            </Modal>
            
            {/* Change Conversation Name Modal */}
            <Modal isOpen={isChangeConversationNameModalOpen} onClose={() => {
                    setIsChangeConversationNameModalOpen(false)
                    setInputValue('');
                    setCharCount(0);
                }}>
                <h2 className="text-lg font-bold mb-3">Đổi tên đoạn chat</h2>
                <div className="flex flex-col items-start justify-start w-full">
                    <p className="text-gray-600 text-sm mb-1">Mọi người đều biết khi đổi tên nhóm chat thay đổi.</p>
                    <div className="relative w-full">
                        <div className="absolute flex flex-row justify-between items-center w-full p-2">
                            <p className="text-blue-600 text-xs">Tên đoạn chat</p>
                            <p className={`text-xs ${charCount > 255 ? 'text-red-500' : ''}`}>{charCount} / 255</p>
                        </div>
                        <input type="text" className="w-full p-2 pt-8 border border-gray-200 rounded-lg 
                            focus:border-blue-500" placeholder="" 
                            value={inputValue}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 255) {
                                    setInputValue(value); 
                                    setCharCount(value.length);
                                  }
                            }}/>
                    </div>
                </div>
            </Modal>

            {/* Change Chat Emoji Modal */}
            <Modal isOpen={isChangeConversationEmojiModalOpen} onClose={() => setIsChangeConversationEmojiModalOpen(false)}>
                <h2 className="text-lg font-bold mb-3">Biểu tượng cảm xúc</h2>
                <div className="flex flex-col items-start justify-start w-full">
                    <EmojiPicker width={420} height={420}/>
                </div>
            </Modal>

        </div>
    );
}

export default ChatAndInfo;

