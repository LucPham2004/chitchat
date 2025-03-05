import { FaArrowLeft, FaLink, FaUserCircle } from "react-icons/fa";
import { TiPin } from "react-icons/ti";
import { FaBell, FaImage, FaPenNib } from "react-icons/fa6";
import { IoImages, IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from 'react-icons/io';
import { ReactNode, useState } from "react";
import { PiTextAa } from "react-icons/pi";
import { FaFileAlt } from "react-icons/fa";
import { BsFillBellFill, BsFillBellSlashFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { ImBlocked } from "react-icons/im";
import ParticipantCard from "./ParticipantCard";
import MediaGrid from "./MediaGrid";
import { linkUrls } from "../../../../FakeData";
import { Link } from "react-router-dom";
import useDeviceTypeByWidth from "../../../../utilities/useDeviceTypeByWidth";
import { useTheme } from "../../../../utilities/ThemeContext";
import { ConversationResponse } from "../../../../types/Conversation";


export interface ConversationInfoProps {
    togglePinnedMessageModalOpen: () => void;
    toggleChangeConversationNameModalOpen: () => void;
    toggleChangeConversationEmojiModalOpen: () => void;
    toggleChangeWidth: () => void;
    conversationResponse?: ConversationResponse;
}

interface AccordionItem {
    title: string;
    content: ReactNode;
}

const ConversationInfo: React.FC<ConversationInfoProps> = ({ 
    togglePinnedMessageModalOpen,
    toggleChangeConversationNameModalOpen,
    toggleChangeConversationEmojiModalOpen,
    toggleChangeWidth,
    conversationResponse
 }) => {

	const deviceType = useDeviceTypeByWidth();
    const { isDarkMode  } = useTheme();
    const [openIndices, setOpenIndices] = useState<number[]>([3]);

    const toggleAccordion = (index: number) => {
        setOpenIndices((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
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
                            🐧
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
        },
        {
            title: 'Các thành viên trong đoạn chat',
            content: (
                <div className="relative">
                    <ParticipantCard id={"1"} avatar={"/avatar.jpg"} name={"Tiến Lực"} toggleUserMenu={toggleUserMenu}/>
                    {isUserMenuOpen && (
                            <div className="absolute top-8 right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                                <ul className="text-gray-700 p-1">
                                    <Link to={"/profile"}>
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
        }
    ];

    const [activeTab, setActiveTab] = useState('default'); // Tab mặc định
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationDirection, setAnimationDirection] = useState('');

    const handleTabChange = (tab: any) => {
        if (tab !== activeTab) {
            setAnimationDirection(tab !== 'default' ? 'left' : 'right');
            setIsAnimating(true);

            setTimeout(() => {
                setActiveTab(tab);
                setIsAnimating(false);
            }, 100); // Thời gian chuyển đổi
        }
    };

    const mediaList:string[] = [];
    const fileList:string[] = linkUrls;
    const linkList:string[] = linkUrls;

    // Nội dung từng tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'media':
                return (
                    mediaList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center w-60 h-60">
                            <p className={`text-md font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                Không có file phương tiện nào</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                Ảnh và video các bạn trao đổi với nhau sẽ hiện ở đây</p>
                        </div>
                    ) :
                        <MediaGrid medias={mediaList} />
                );
            case 'files':
                return (
                    fileList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center w-60 h-60">
                            <p className={`text-md font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                Không có file nào</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                File các bạn trao đổi với nhau sẽ hiện ở đây</p>
                        </div>
                    ) :
                        <div className="flex flex-col max-h-[74vh] overflow-y-auto rounded-lg">
                            {fileList.map((file, index) => (
                                <div>
                                    <div key={index} className={`flex items-center gap-2 pt-2 mb-2 text-md font-medium 
                                        ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                        <div className={`text-lg px-2 h-12 flex items-center justify-center rounded-lg
                                            ${isDarkMode ? 'bg-[#474747]' : 'bg-gray-200'}`}>
                                            <FaFileAlt />
                                        </div>
                                        <p>{file}</p>
                                    </div>
                                    <hr></hr>
                                </div>
                            ))}
                        </div>
                );
            case 'links':
                return (
                    linkList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center w-60 h-60">
                            <p className={`text-md font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                Không có liên kết nào</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                            Liên kết các bạn trao đổi với nhóm này sẽ hiện ở đây</p>
                        </div>
                    ) :
                        <div className="flex flex-col max-h-[74vh] overflow-y-auto rounded-lg">
                            {linkList.map((link, index) => (
                                <div>
                                    <div key={index} className={`flex items-center gap-2 pt-2 mb-2 text-md font-medium 
                                        ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                        <div className={`text-lg px-2 h-12 flex items-center justify-center rounded-lg
                                            ${isDarkMode ? 'bg-[#474747]' : 'bg-gray-200'}`}>
                                            <FaLink />
                                        </div>
                                        <a href={link} target="blank" className="ps-0.5">{link}</a>
                                    </div>
                                    <hr></hr>
                                </div>
                            ))}
                        </div>
                );
            default:
                return (
                    <div className={`relative flex flex-col gap-2 min-w-full min-h-[96vh] max-h-[96vh] overflow-y-auto 
                        p-1 pb-0 rounded-xl border shadow-sm transition-transform duration-300 
                        ${isAnimating ? (animationDirection === 'right' ? 'translate-x-full' : '-translate-x-full') : ''}
                        ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>

                        {deviceType !== 'PC' &&
                            <button className={`absolute w-fit p-2 top-4 left-4 text-left text-xl font-medium rounded-full 
                                ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]' 
                                    : 'text-gray-800 hover:bg-gray-100'}`}
                                onClick={() => toggleChangeWidth()}>
                                <FaArrowLeft />
                            </button>
                        }

                        <div className="flex flex-col items-center gap-1 p-2">
                            <img className="w-20 h-20 rounded-full object-cover" src="https://lh3.googleusercontent.com/proxy/tm1RJoA6rodhWBKMGRfzeR74pIbdxub44suRwIU0sEoJmhWqKL6fdcu2dam9sX15_HKYaodIjV_63KdvKVR9OIxN6tq9hL2NsGJMDSjwdOowrZrKnJWaCT2AC3HI6KjJyAkf0S9y6wBzJVzblA"></img>
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>Cristiano Ronaldo</h3>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>Đang hoạt động</p>
                        </div>

                        <div className={`flex flex-row justify-center gap-4 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                            <div className="flex flex-col items-center w-[70px] text-center">
                                <button className={`p-2 text-xl rounded-full
                                    ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]' 
                                    : 'text-black bg-gray-100 hover:bg-gray-200'}`}>
                                    <FaUserCircle />
                                </button>
                                <p className="text-sm">Trang cá nhân</p>
                            </div>

                            <div className="flex flex-col items-center w-[70px] text-center">
                                <button className={`p-2 text-xl rounded-full
                                    ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]' 
                                    : 'text-black bg-gray-100 hover:bg-gray-200'}`}>
                                    <BsFillBellFill />
                                </button>
                                <p className="text-sm">Tắt thông báo</p>
                            </div>

                            <div className="flex flex-col items-center w-[70px] text-center">
                                <button className={`p-2 text-xl rounded-full
                                    ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]' 
                                    : 'text-black bg-gray-100 hover:bg-gray-200'}`}>
                                    <IoSearch />
                                </button>
                                <p className="text-sm">Tìm kiếm</p>
                            </div>
                        </div>

                        <div className="flex flex-col p-2">
                            {sections.map((section, index) => (
                                <div key={index} className="">
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        className={`flex justify-between w-full p-2 py-3 text-left text-md font-medium rounded-lg 
                                        ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' 
                                            : 'text-gray-800 hover:bg-gray-100'}`}
                                    >
                                        {section.title}
                                        <span
                                            className={`transform transition-transform duration-300 
                                                ${openIndices.includes(index) ? 'rotate-180' : 'rotate-0'}`}>
                                            <IoIosArrowDown />
                                        </span>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out 
                                            ${openIndices.includes(index) ? 'max-h-60' : 'max-h-0'}`}>
                                        <div className="">{section.content}</div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                );
        }
    };

    return (
        activeTab !== 'default' ? (
            <div className={`flex flex-col gap-4 min-w-full min-h-[96vh] max-h-[96vh] overflow-y-auto 
                pt-1 px-3 rounded-xl border shadow-sm transition-transform duration-300 
                ${isAnimating ? (animationDirection === 'right' ? 'translate-x-full' : '-translate-x-full') : ''}
                ${isDarkMode ? 'text-gray-300 bg-[#1F1F1F] border-gray-800' : 'text-black bg-white border-gray-200'}`}
            >
                <div className="flex items-center gap-2 p-2">
                    <button className={`flex items-center gap-2 p-2 text-left text-lg font-medium 
                        rounded-full 
                        ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]' 
                            : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={() => handleTabChange('default')}>
                        <FaArrowLeft />
                    </button>
                    <p className="text-lg font-semibold">File phương tiện, file và liên kết</p>
                </div>

                <div className={`flex justify-between border rounded-full 
                    ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <button
                        className={`rounded-full p-2 text-center font-semibold 
                            ${activeTab === 'media' ? isDarkMode ? 'text-gray-300 bg-[#474747]' 
                                : 'text-black bg-gray-200' : isDarkMode ? 'text-gray-400' 
                                : 'text-gray-500'}`}
                        onClick={() => setActiveTab('media')}
                    >
                        File phương tiện
                    </button>
                    <button
                        className={`rounded-full p-2 flex-1 text-center font-semibold 
                            ${activeTab === 'files' ? isDarkMode ? 'text-gray-300 bg-[#474747]' 
                                : 'text-black bg-gray-200' : isDarkMode ? 'text-gray-400' 
                                : 'text-gray-500'}`}
                        onClick={() => setActiveTab('files')}
                    >
                        File
                    </button>
                    <button
                        className={`rounded-full p-2 flex-1 text-center font-semibold 
                            ${activeTab === 'links' ? isDarkMode ? 'text-gray-300 bg-[#474747]' 
                                : 'text-black bg-gray-200' : isDarkMode ? 'text-gray-400' 
                                : 'text-gray-500'}`}
                        onClick={() => setActiveTab('links')}
                    >
                        Liên kết
                    </button>
                </div>

                <div className="p-2 pe-0 flex justify-center">
                    {renderTabContent()}
                </div>
            </div>
        ) : (
            <div className={`min-w-full overflow-hidden  rounded-xl
                ${isAnimating ? (animationDirection === 'right' ? 'translate-x-full' : '') : ''}
                ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
                {renderTabContent()}
            </div>
        )
    );
}

export default ConversationInfo;


