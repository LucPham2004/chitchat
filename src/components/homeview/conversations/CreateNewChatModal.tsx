import { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import { useAuth } from "../../../utilities/AuthContext";
import { UserDTO } from "../../../types/User";
import { getUserFriends } from "../../../services/UserService";
import { createConversation } from "../../../services/ConversationService";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const CreateNewChatModal = ({ isOpen, onClose }: Props) => {
    const { user } = useAuth();
    const [friends, setFriends] = useState<UserDTO[]>([]);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchFriends = async () => {
            setLoading(true);
            setError("");
            try {
                if (user?.user.id) {
                    const response = await getUserFriends(user?.user.id, 0);
                    setFriends(response.result?.content || []);
                }
            } catch (err) {
                console.error("Lỗi lấy danh sách bạn bè:", err);
                setError("Không thể tải danh sách bạn bè.");
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [isOpen, user?.user.id]);

    const handleSelectFriend = (id: number) => {
        setSelectedFriendIds((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const handleCreateChat = async () => {
        if (selectedFriendIds.length === 0) return;
        setCreating(true);
        try {
            if(user?.user.id) {
                const request = {
                    participantIds: [user.user.id, ...selectedFriendIds],
                    ownerId: user.user.id,
                    isGroup: selectedFriendIds.length > 1,
                    emoji: "👍"
                };

                const res = await createConversation(request);
                console.log("Tạo thành công:", res.result);

                if(res.code == 200 && res.result) {
                    // Redirect to the new chat
                    window.location.href = `/conversations/${res.result.id}`;

                }

                onClose();
                setSelectedFriendIds([]);
                setSearchTerm("");
            }
        } catch (err) {
            console.error("Lỗi tạo cuộc trò chuyện:", err);
            alert("Không thể tạo cuộc trò chuyện.");
        } finally {
            setCreating(false);
        }
    };

    const filteredFriends = friends.filter((friend) =>
        friend.firstName.toLowerCase().includes(searchTerm.toLowerCase())
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
                            className="flex items-center gap-3 p-2 border rounded hover:bg-gray-100 transition cursor-pointer"
                        >
                            <img
                                src={friend.avatarUrl}
                                alt={friend.firstName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="flex-1">{friend.firstName + friend.lastName ? `${" " + friend.lastName}` : ''}</span>
                            <input
                                type="checkbox"
                                checked={selectedFriendIds.includes(friend.id)}
                                onChange={() => handleSelectFriend(friend.id)}
                            />
                        </div>
                    ))}
                    {!loading && filteredFriends.length === 0 && (
                        <p className="text-sm text-gray-500">Không tìm thấy bạn bè.</p>
                    )}
                </div>

                {/* Create Button */}
                <button
                    onClick={handleCreateChat}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition disabled:opacity-50"
                    disabled={selectedFriendIds.length === 0}
                >
                    {creating ? "Đang tạo..." : "Tạo"}
                </button>
            </div>
        </Modal>
    );
};

export default CreateNewChatModal;
