import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { friendsData } from "../../FakeData";
import FriendCard from "./FriendCard";
import SearchBar from "../homeview/conversations/SearchBar";



const Friends = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const friends = friendsData;

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex flex-col bg-white
            pb-0 rounded-xl border border-gray-200 shadow-sm overflow-y-auto">

                <div className="sticky top-0 z-10 w-full bg-white flex px-4
                    items-center justify-between border-b-2 border-gray-200">
                    <div className="absolute top-4 left-4 z-10">
                        <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-100"
                            onClick={goBack}>
                            <FaArrowLeft />
                        </button>
                    </div>
                    <div className="justify-center self-center w-full text-center text-lg 
                        font-semibold p-4">
                        Bạn bè
                    </div>
                    
                    <div className="flex flex-row items-center justify-center gap-4">
                        <div className="w-300px">
                            <SearchBar />
                        </div>
                        <button className="w-max h-fit py-2 px-4 text-md 
                            border-2 border-black text-black bg-white 
                            hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                            rounded-full shadow-md transition duration-100">
                            Lời mời kết bạn
                        </button>
                        <button className="w-max h-fit py-2 px-4 text-md 
                            border-2 border-black text-black bg-white 
                            hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                            rounded-full shadow-md transition duration-100">
                            Tìm bạn bè
                        </button>
                    </div>
                </div>
            <div className="min-h-[86vh] max-h-[90vh] overflow-y-auto">
                <div className="w-full flex items-center justify-center gap-4 flex-wrap p-4">
                    {friends.map(friend => (
                        <FriendCard key={friend.id} friend={friend} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Friends;

