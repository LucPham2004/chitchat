import { useState } from "react";
import ConversationInfo from "./conversationInfo/ConversationInfo";
import MainChat from "./mainchat/MainChat";

const ChatAndInfo: React.FC = () => {
    const [isFullScreen, setFullScreen] = useState(false); // Trạng thái fullScreen

    // Hàm toggle chuyển đổi giữa 100% và mặc định
    const toggleFullScreen = () => setFullScreen(!isFullScreen);

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden min-w-[74%] flex flex-row items-center bg-gray-100
            gap-4 pb-0">
            <div className={`transition-all duration-300 ${isFullScreen ? 'w-full' : 'w-[66%]'}`}>
                <MainChat toggleFullScreen={toggleFullScreen} />
            </div>
            <div className={`transition-all duration-300 ${isFullScreen ? 'w-0' : 'w-[33%]'}`}>
                <ConversationInfo />
            </div>
        </div>
    );
}

export default ChatAndInfo;

