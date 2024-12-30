import { useState } from "react";
import ConversationInfo from "./conversationInfo/ConversationInfo";
import MainChat from "./mainchat/MainChat";
import { ChangeWidthProps } from "../../../views/HomeView";

const ChatAndInfo: React.FC<ChangeWidthProps> = ({ toggleChangeWidth, isChangeWidth }) => {
    

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex flex-row items-center bg-gray-100
            pb-0">
            <div className={`transition-all duration-100 ${isChangeWidth ? 'w-full me-0' : 'w-[66%] me-4'}`}>
                <MainChat toggleChangeWidth={toggleChangeWidth} isChangeWidth={isChangeWidth} />
            </div>
            <div className={`transition-all duration-100 ${isChangeWidth ? 'w-0' : 'w-[33%]'}`}>
                <ConversationInfo />
            </div>
        </div>
    );
}

export default ChatAndInfo;

