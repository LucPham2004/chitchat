import ConversationInfo from "./conversationInfo/ConversationInfo";
import MainChat from "./mainchat/MainChat";

const ChatAndInfo = () => {

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden min-w-[74%] flex flex-row items-center bg-gray-100
            gap-4 pb-0">
            <MainChat />
            <ConversationInfo />
        </div>
    );
}

export default ChatAndInfo;

