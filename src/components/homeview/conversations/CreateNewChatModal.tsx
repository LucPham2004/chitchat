import { useState } from "react";
import Modal from "../../common/Modal";

type Friend = {
    id: number;
    name: string;
    avatarUrl: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    friends: Friend[];
};

const CreateNewChatModal = ({ isOpen, onClose, friends }: Props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);

    const handleSelectFriend = (id: number) => {
        setSelectedFriendIds((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const handleCreateChat = () => {
        if (selectedFriendIds.length === 0) return;

        
        onClose();
        setSelectedFriendIds([]);
        setSearchTerm("");
    };

    const filteredFriends = friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <p className="text-lg font-bold mb-3">Tạo cuộc trò chuyện mới</p>
            <div className="flex flex-col gap-4 w-full">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Tìm kiếm bạn bè..."
                    className="w-full p-2 border rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Friend List */}
                <div className="flex flex-col max-h-64 overflow-y-auto gap-2">
                    {filteredFriends.map((friend) => (
                        <div
                            key={friend.id}
                            className="flex items-center gap-3 p-2 border rounded hover:bg-gray-100 transition"
                        >
                            <img
                                src={friend.avatarUrl}
                                alt={friend.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="flex-1">{friend.name}</span>
                            <input
                                type="checkbox"
                                checked={selectedFriendIds.includes(friend.id)}
                                onChange={() => handleSelectFriend(friend.id)}
                            />
                        </div>
                    ))}
                    {filteredFriends.length === 0 && (
                        <p className="text-sm text-gray-500">Không tìm thấy bạn bè.</p>
                    )}
                </div>

                {/* Create Button */}
                <button
                    onClick={handleCreateChat}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition disabled:opacity-50"
                    disabled={selectedFriendIds.length === 0}
                >
                    Tạo
                </button>
            </div>
        </Modal>
    );
};

export default CreateNewChatModal;
