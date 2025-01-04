import { PiDotsThreeOutline } from "react-icons/pi";
import { FriendCardProps } from "./FriendCard";



const UserCard: React.FC<FriendCardProps> = ({ friend, isOpen, toggleFriendMenuOpen }) => {
    // const { user } = useAuth();
    // const { acceptFriendRequest, rejectFriendRequest } = useFriendRequest();

    // const handleAccept = async () => {
    //     await acceptFriendRequest(friendRequest.id);
    // };

    // const handleReject = async () => {
    //     await rejectFriendRequest(friendRequest.id);
    // };

    return (
        <div className="min-w-[500px] flex items-center justify-between gap-2 p-2 border border-gray-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
                <img src={friend.avatar} alt={friend.name} className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex flex-col items-start text-gray-600">
                    <h3 className="text-lg">{friend.name}</h3>
                    <p className="text-sm font-semibold">{friend.mutualFriends} bạn chung</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <button className={`rounded-full hover:bg-blue-600 border-2 hover:text-white py-2 px-3 text-center text-sm font-semibold 
                    bg-white text-blue-600 border-blue-600`}
                    onClick={toggleFriendMenuOpen}>
                    Gửi lời kết bạn
                </button>
                <button className={`rounded-full hover:bg-gray-200 p-2 text-center text-2xl font-semibold 
                    ${isOpen ? 'bg-gray-200' : ''}`}
                    onClick={toggleFriendMenuOpen}>
                    <PiDotsThreeOutline />
                </button>
            </div>
        </div>
    );
};

export default UserCard;


