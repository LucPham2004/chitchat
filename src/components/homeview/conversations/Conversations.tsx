import { BsPencilSquare } from "react-icons/bs";
import ConversationList from "./ConversationList";
import '../../../styles/scrollbar.css';
import SearchBar from "./SearchBar";

const Conversations = () => {
    
    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden min-w-full flex flex-col items-center bg-white 
            p-2 pb-0 rounded-xl border border-gray-200 shadow-sm">

            <div className="flex flex-row items-center p-2 py-0 self-start w-full">
                <h2 className="flex self-start text-2xl font-bold text-left text-gray-800 w-[35%]"> Đoạn chat </h2>
                <div className="flex flex-row gap-4 items-center justify-end w-[65%]">
                    <button className="p-2 rounded-full text-black text-xl bg-gray-100 hover:bg-gray-200">
                        <BsPencilSquare />
                    </button>
                    <button className="rounded-full text-black">
                        <img src="/avatar.jpg" className="w-8 h-8 rounded-full"/>
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center w-full h-full p-2">
                <SearchBar />
            </div>

            <div className="flex flex-col items-center w-full h-full p-2 py-1 overflow-y-auto">
                <ConversationList />
            </div>
        </div>
    );
}

export default Conversations;

