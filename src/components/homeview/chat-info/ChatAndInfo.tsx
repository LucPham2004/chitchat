import MainChat from "./MainChat";

const ChatAndInfo = () => {

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden min-w-[74%] flex flex-col items-center bg-white
            pb-0 rounded-xl border border-gray-200 shadow-sm">
            <MainChat />
        </div>
    );
}

export default ChatAndInfo;

