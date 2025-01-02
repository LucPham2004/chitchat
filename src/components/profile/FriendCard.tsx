import { PiDotsThreeOutline } from "react-icons/pi";
import { Friend } from "../../types/Friend";



const FriendCard = ({ friend }: { friend: Friend }) => {
    return (
        <div className="min-w-[480px] flex items-center justify-between gap-4 p-2 border border-gray-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
                <img src={friend.avatar} alt={friend.name} className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex flex-col items-start text-gray-600">
                    <h3 className="text-lg">{friend.name}</h3>
                    <p className="text-sm font-semibold">{friend.mutualFriends} bạn chung</p>
                </div>
            </div>
            <button className="rounded-full hover:bg-gray-200 p-2 text-center text-2xl font-semibold">
                <PiDotsThreeOutline />
            </button>
        </div>
    );
}

export default FriendCard;


