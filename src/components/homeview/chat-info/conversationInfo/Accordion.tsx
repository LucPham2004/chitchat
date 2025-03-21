import { ReactNode, useState } from "react";
import AccordionItem from "./AccordionItem";
import { BsFillBellSlashFill } from "react-icons/bs";
import { FaPenNib, FaImage, FaFileAlt, FaLink } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { ImBlocked } from "react-icons/im";
import { IoImages } from "react-icons/io5";
import { PiTextAa } from "react-icons/pi";
import { TiPin } from "react-icons/ti";
import { Link } from "react-router-dom";
import ParticipantCard from "./ParticipantCard";
import { useTheme } from "../../../../utilities/ThemeContext";


interface AccordionProps {
    togglePinnedMessageModalOpen: () => void;
    toggleChangeConversationNameModalOpen: () => void;
    toggleChangeConversationEmojiModalOpen: () => void;
    handleTabChange: (tab: string) => void;
    isUserMenuOpen: boolean;
    toggleUserMenu: () => void;
    isGroup?: boolean | undefined;
    emoji?: string;
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
    isUserMenuOpen,
    toggleUserMenu,
    isGroup,
    emoji
 }) => {
    const { isDarkMode  } = useTheme();
    const hidden = false;
    const [openIndices, setOpenIndices] = useState<number[]>([3]);
    
    const toggleAccordion = (index: number) => {
        setOpenIndices((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };
    
    const sections: AccordionItem[] = [
        {
            title: 'Thông tin về đoạn chat',
            content: (
                <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
                    onClick={togglePinnedMessageModalOpen}>
                    <div className={`rounded-full p-1 text-xl ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                        <TiPin />
                    </div>
                    <p>Xem tin nhắn đã ghim</p>
                </button>
            ),
            hidden: hidden
        },
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

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <FaImage />
                        </div>
                        <p>Thay đổi ảnh</p>
                    </button>

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={toggleChangeConversationEmojiModalOpen}>
                        <div className={`rounded-full p-1.5 text- ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            {emoji}
                        </div>
                        <p>Thay đổi biểu tượng cảm xúc</p>
                    </button>

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <PiTextAa />
                        </div>
                        <p>Chỉnh sửa biệt danh</p>
                    </button>
                </div>
            ),
            hidden: hidden
        },
        {
            title: 'Các thành viên trong đoạn chat',
            content: (
                <div className="relative">
                    <ParticipantCard id={"1"} avatar={"/avatar.jpg"} name={"Tiến Lực"} toggleUserMenu={toggleUserMenu}/>
                    {isUserMenuOpen && (
                        <div className="absolute top-8 right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
                            <ul className="text-gray-700 p-1">
                                <Link to={`/profile/${"1"}`}>
                                    <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold hover:bg-gray-100 cursor-pointer">
                                        <img src="/avatar.jpg" className="w-8 h-8 rounded-full"/>
                                        Xem trang cá nhân
                                    </li>
                                </Link>
                                <hr></hr>
                                <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold hover:bg-gray-100 cursor-pointer">
                                    <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-200">
                                        
                                    </button>
                                    Nhắn tin
                                </li>
                                <hr></hr>
                                <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold hover:bg-gray-100 cursor-pointer">
                                    <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-200">
                                        <FiLogOut />
                                    </button>
                                    Chặn
                                </li>
                            </ul>
                        </div>
                        )}
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

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <BsFillBellSlashFill />
                        </div>
                        <p>Tắt thông báo</p>
                    </button>

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <div className={`rounded-full p-2 text-lg ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <ImBlocked />
                        </div>
                        <p>Chặn</p>
                    </button>

                    <button className={`flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <div className={`rounded-full p-2 text-xl ${isDarkMode ? 'bg-[#3A3A3A]' : 'bg-gray-200'}`}>
                            <FiLogOut />
                        </div>
                        <p>Rời nhóm</p>
                    </button>
                </div>
            ),
            hidden: hidden
        }
    ];

    return (
        <div className="rounded-lg overflow-hidden">
            {sections.map((section, index) => (
                <AccordionItem key={index} 
                    title={section.title}
                    content={section.content}
                    toggleAccordion={toggleAccordion}
                    index={index}
                    openIndices={openIndices}
                    hidden={section.hidden}
                    >
                </AccordionItem>
            ))}
        </div>
    );
};

export default Accordion;