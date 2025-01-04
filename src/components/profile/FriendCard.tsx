import { PiDotsThreeOutline } from "react-icons/pi";
import { Friend } from "../../types/Friend";
import { IoChatbubblesSharp } from "react-icons/io5";

export interface FriendCardProps {
    friend: Friend;
    isOpen: boolean;
    toggleFriendMenuOpen?: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, isOpen, toggleFriendMenuOpen }) => {
    return (
        <div className="min-w-[520px] flex items-center justify-between gap-4 p-2 border border-gray-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
                <img src={friend.avatar} alt={friend.name} className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex flex-col items-start text-gray-600">
                    <h3 className="text-lg">{friend.name}</h3>
                    <p className="text-sm font-semibold">{friend.mutualFriends} bạn chung</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                    border-2 border-blue-400 text-blue-700 bg-white 
                    hover:bg-gradient-to-r from-blue-500 to-blue-400 hover:text-white 
                    rounded-full shadow-md transition duration-200">
                    <IoChatbubblesSharp />
                    <p className="font-semibold">Nhắn tin</p>
                </button>
                <button className={`rounded-full hover:bg-gray-200 p-2 text-center text-2xl font-semibold ${isOpen ? 'bg-gray-200' : ''}`}
                    onClick={toggleFriendMenuOpen}>
                    <PiDotsThreeOutline />
                </button>
            </div>
        </div>
    );
}

export default FriendCard;


