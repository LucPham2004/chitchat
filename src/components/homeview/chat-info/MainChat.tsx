import ChatBody from "./ChatBody"
import ChatFooter from "./ChatFooter"
import ChatHeader from "./ChatHeader"


const MainChat = () => {
    return (
        <div className="w-full h-full flex flex-col items-center bg-white p-1 pb-0 rounded-xl border border-gray-200 shadow-sm">
            <ChatHeader />
            <ChatBody />
            <ChatFooter />
        </div>
    )
}

export default MainChat

