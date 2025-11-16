import { ReactNode, useState } from "react";
import AccordionItem from "./AccordionItem";
import { FaPenNib, FaImage, FaFileAlt, FaLink } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoImages } from "react-icons/io5";
import ParticipantCard from "./ParticipantCard";
import { useTheme } from "../../../../utilities/ThemeContext";
import { ChatParticipants } from "../../../../types/User";
import { useAuth } from "../../../../utilities/AuthContext";
import { updateConversation } from "../../../../services/ConversationService";
import { ImBlocked } from "react-icons/im";


interface AccordionProps {
    togglePinnedMessageModalOpen: () => void;
    toggleChangeConversationNameModalOpen: () => void;
    toggleChangeConversationEmojiModalOpen: () => void;
    handleTabChange: (tab: string) => void;
    handleBlockUser: () => void;
    selectedParticipantId: string | null;
    toggleUserMenu: (id: string) => void;
    isGroup?: boolean | undefined;
    emoji?: string;
    participants?: ChatParticipants[];
}

interface AccordionItem {
    title: string;
    content: ReactNode;
    hidden?: boolean | undefined;
}

const Accordion: React.FC<AccordionProps> = ({
    togglePinnedMessageModalOpen,
    toggleChangeConversationNameModalOpen,
    toggleChangeConversationEmojiModalOpen,
    handleTabChange,
    handleBlockUser,
    selectedParticipantId,
    toggleUserMenu,
    isGroup,
    emoji,
    participants
}) => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const hidden = false;
    const [openIndices, setOpenIndices] = useState<number[]>([2]);

    const toggleAccordion = (index: number) => {
        setOpenIndices((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const sections: AccordionItem[] = [
        // {
        //     title: 'Thông tin về đoạn chat',
        //     content: (
        //         <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
        //             rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
        //             onClick={togglePinnedMessageModalOpen}>
        //             <div className={`rounded-full p-1 text-xl ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
        //                 <TiPin />
        //             </div>
        //             <p>Xem tin nhắn đã ghim</p>
        //         </button>
        //     ),
        //     hidden: hidden
        // },
        {
            title: 'Tuỳ chỉnh đoạn chat',
            content: (
                <div>
                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={toggleChangeConversationNameModalOpen}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <FaPenNib />
                        </div>
                        <p>Đổi tên đoạn chat</p>
                    </button>
{/* 
                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <FaImage />
                        </div>
                        <p>Thay đổi ảnh</p>
                    </button> */}

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={toggleChangeConversationEmojiModalOpen}>
                        <div className={`rounded-full p-1.5 text- ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            {emoji ?? "👍"}
                        </div>
                        <p>Thay đổi biểu tượng cảm xúc</p>
                    </button>
{/* 
                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <PiTextAa />
                        </div>
                        <p>Chỉnh sửa biệt danh</p>
                    </button> */}
                </div>
            ),
            hidden: hidden
        },
        {
            title: 'Các thành viên trong đoạn chat',
            content: (
                <div className="relative">
                    {participants?.map((participant) => (
                        <div key={participant.id}>
                            <ParticipantCard 
                                id={participant.id} 
                                avatar={participant.avatarUrl} 
                                name={participant.firstName + " " + `${participant.lastName ? participant.lastName : ''}`} 
                                toggleUserMenu={toggleUserMenu} 
                                selectedParticipantId={selectedParticipantId}
                            />
                        </div>
                    ))}
                </div>
            ),
            hidden: isGroup ? false : true
        },
        {
            title: 'File phương tiện, file và liên kết',
            content: (
                <div>

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={() => handleTabChange('media')}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <IoImages />
                        </div>
                        <p>File phương tiện</p>
                    </button>

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={() => handleTabChange('files')}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <FaFileAlt />
                        </div>
                        <p>File</p>
                    </button>

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={() => handleTabChange('links')}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <FaLink />
                        </div>
                        <p>Liên kết</p>
                    </button>
                </div>
            ),
            hidden: hidden
        },
        {
            title: 'Quyền riêng tư và hỗ trợ',
            content: (
                <div>

                    {/* <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <BsFillBellSlashFill />
                        </div>
                        <p>Tắt thông báo</p>
                    </button> */}

                    {/* <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                        rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <ImBlocked />
                        </div>
                        <p>Chặn</p>
                    </button> */}

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                        rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={async () => {
                                    if (user?.user.id && participants) {
                                        const confirmDelete = window.confirm("Bạn có chắc chắn muốn rời khỏi đoạn chat này?");
                                        if (confirmDelete) {
                                            const updatedParticipants = participants.filter(participant => participant.id !== user?.user.id);
                                            const participantIds = updatedParticipants.map(participant => participant.id);
                                            await updateConversation({ participantIds }, user?.user.id);
                                        }
                                    }
                                    console.log("Đã cập nhật cuộc trò chuyện!");
                                }}>
                        <div className={`rounded-full p-2 text-xl ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <FiLogOut />
                        </div>
                        <p>Rời nhóm</p>
                    </button>
                </div>
            ),
            hidden: !isGroup
        },
        {
            title: 'Quyền riêng tư và hỗ trợ',
            content: (
                <div>
                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                        rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={handleBlockUser}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <ImBlocked />
                        </div>
                        <p>Chặn</p>
                    </button>
                </div>
            ),
            hidden: isGroup
        }
    ];

    return (
        <div className="rounded-lg overflow-hidden">
            {isGroup && (
                <hr className="w-[100%] mt-2 mb-2 border-gray-600"></hr>
            )}
            {sections.map((section, index) => (
                <AccordionItem key={index}
                    title={section.title}
                    content={section.content}
                    toggleAccordion={toggleAccordion}
                    index={index}
                    openIndices={openIndices}
                    hidden={section.hidden}
                    isGroup={isGroup}
                >
                </AccordionItem>
            ))}
        </div>
    );
};

export default Accordion;