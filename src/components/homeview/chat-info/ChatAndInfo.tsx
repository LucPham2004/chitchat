import { useState } from "react";
import ConversationInfo from "./conversationInfo/ConversationInfo";
import MainChat from "./mainchat/MainChat";
import { ChangeWidthProps } from "../../../views/HomeView";
import Modal from "../../modals/Modal";
import { pinnedMessagesData } from "../../../FakeData";
import ChatMessage from "./mainchat/ChatMessage";


export interface PinnedMessageModalOpenProps {
    togglePinnedMessageModalOpen: () => void;
}

const ChatAndInfo: React.FC<ChangeWidthProps> = ({ toggleChangeWidth, isChangeWidth }) => {
    const [isPinnedMessageModalOpen, setIsPinnedMessageModalOpen] = useState(false);
    const togglePinnedMessageModalOpen = () => setIsPinnedMessageModalOpen(!isPinnedMessageModalOpen);

    const pinnedMessages = pinnedMessagesData;

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex flex-row items-center bg-gray-100
            pb-0">
            <div className={`transition-all duration-100 ${isChangeWidth ? 'w-full me-0' : 'w-[66%] me-4'}`}>
                <MainChat toggleChangeWidth={toggleChangeWidth} isChangeWidth={isChangeWidth} />
            </div>
            <div className={`transition-all duration-100 ${isChangeWidth ? 'w-0' : 'w-[33%]'}`}>
                <ConversationInfo togglePinnedMessageModalOpen={togglePinnedMessageModalOpen}/>
            </div>

            {/* Pinned Messages Modal */}
            <Modal isOpen={isPinnedMessageModalOpen} onClose={() => setIsPinnedMessageModalOpen(false)}>
                <h2 className="text-lg font-bold mb-2">Tin nhắn đã ghim</h2>
                {pinnedMessages.length > 0 ? (
                <div className="flex flex-col items-start justify-start w-full overflow-y-auto">
                    {pinnedMessages.map((message, index) => (
                        <div className="flex flex-col p-1 items-start justify-start w-full">
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


        </div>
    );
}

export default ChatAndInfo;

