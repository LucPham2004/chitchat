import ChatMessage from "./ChatMessage"


const ChatBody = () => {


    
    return (
        <div className="w-full h-[80%] flex flex-col items-center bg-white p-1 pb-0 shadow-sm">
            <ChatMessage message={{
                text: "",
                user: ""
            }} name={""} />
        </div>
    )
}

export default ChatBody

