import { PiDotsThreeOutline } from "react-icons/pi";
import { FriendCardProps } from "./FriendCard";
import { FaUserPlus } from "react-icons/fa";



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
        <div className="min-w-[520px] flex items-center justify-between gap-2 p-2 border border-gray-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
                <img src={friend.avatar} alt={friend.name} className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex flex-col items-start text-gray-600">
                    <h3 className="text-lg">{friend.name}</h3>
                    <p className="text-sm font-semibold">{friend.mutualFriends} bạn chung</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <button className={`flex items-center gap-2 hover:bg-blue-600 py-2 px-3 
                    text-center text-md font-semibold border-2 border-blue-400 text-blue-700 bg-white 
                    hover:bg-gradient-to-r from-blue-500 to-blue-400 hover:text-white 
                    rounded-full shadow-md transition duration-200`}>
                    <FaUserPlus />
                    <p className="text-sm">Gửi lời kết bạn</p>
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


