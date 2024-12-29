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


interface AccordionItem {
    title: string;
    content: ReactNode;
}

const ConversationInfo = () => {

    const [openIndices, setOpenIndices] = useState<number[]>([]);

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
                <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                text-gray-800 rounded-lg hover:bg-gray-100">
                    <div className="bg-gray-200 rounded-full p-1 text-xl">
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
                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100">
                        <div className="bg-gray-200 rounded-full p-2 text-lg">
                            <FaPenNib />
                        </div>
                        <p>Đổi tên đoạn chat</p>
                    </button>

                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100">
                        <div className="bg-gray-200 rounded-full p-2 text-lg">
                            <FaImage />
                        </div>
                        <p>Thay đổi ảnh</p>
                    </button>

                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100">
                        <div className="bg-gray-200 rounded-full p-1.5 text-md">
                            🐧
                        </div>
                        <p>Thay đổi biểu tượng cảm xúc</p>
                    </button>

                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100">
                        <div className="bg-gray-200 rounded-full p-2 text-lg">
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
                <div>
                    <ParticipantCard id={"1"} avatar={"https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-1/426557674_2024821517893555_8163706382522298168_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=gxJAQWu02SEQ7kNvgFtk5_Q&_nc_oc=AdgJUyZIoWTc55dBmIgR1kGpQUUHrfpas3VBIjam2Jy0x1o0F8cwbjjGVuo151G4qEjSAlu65JQlI6PFJJ1p_DNZ&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fhan20-1.fna&_nc_gid=AHlEaSB8HywVcln6T29bS7V&oh=00_AYCWr9OsAQ_mp2d9tO6WdCz4C44M_Nn2MIgamy1l6O2oVw&oe=67746D85"} name={"Tiến Lực"} />
                </div>
            ),
        },
        {
            title: 'File phương tiện, file và liên kết',
            content: (
                <div>

                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100"
                        onClick={() => handleTabChange('media')}>
                        <div className="bg-gray-200 rounded-full p-2 text-lg">
                            <IoImages />
                        </div>
                        <p>File phương tiện</p>
                    </button>

                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100"
                        onClick={() => handleTabChange('files')}>
                        <div className="bg-gray-200 rounded-full p-2 text-lg">
                            <FaFileAlt />
                        </div>
                        <p>File</p>
                    </button>

                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100"
                        onClick={() => handleTabChange('links')}>
                        <div className="bg-gray-200 rounded-full p-2 text-lg">
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

                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100">
                        <div className="bg-gray-200 rounded-full p-2 text-lg">
                            <BsFillBellSlashFill />
                        </div>
                        <p>Tắt thông báo</p>
                    </button>

                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100">
                        <div className="bg-gray-200 rounded-full p-2 text-lg">
                            <ImBlocked />
                        </div>
                        <p>Chặn</p>
                    </button>

                    <button className="flex items-center gap-2 w-full p-2 text-left text-md font-medium 
                    text-gray-800 rounded-lg hover:bg-gray-100">
                        <div className="bg-gray-200 rounded-full p-2 text-xl">
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
            }, 300); // Thời gian chuyển đổi
        }
    };

    // Nội dung từng tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'media':
                return <div>Danh sách file phương tiện</div>;
            case 'files':
                return <div>Danh sách các file</div>;
            case 'links':
                return <div>Danh sách các liên kết</div>;
        }
    };

    return (
        <div className="flex flex-row max-w-full overflow-hidden">

            <div className="flex flex-col gap-4 w-full min-h-[96vh] max-h-[96vh] overflow-y-auto 
            bg-white p-1 pb-0 rounded-xl border border-gray-200 shadow-sm">

                <div className="flex flex-col items-center gap-2 p-2">
                    <img className="w-20 h-20 rounded-full object-cover" src="https://lh3.googleusercontent.com/proxy/tm1RJoA6rodhWBKMGRfzeR74pIbdxub44suRwIU0sEoJmhWqKL6fdcu2dam9sX15_HKYaodIjV_63KdvKVR9OIxN6tq9hL2NsGJMDSjwdOowrZrKnJWaCT2AC3HI6KjJyAkf0S9y6wBzJVzblA"></img>
                    <h3 className="text-xl font-semibold">Cristiano Ronaldo</h3>
                    <p className="text-gray-500 text-xs">Đang hoạt động</p>
                </div>

                <div className="flex flex-row justify-center gap-4">
                    <div className="flex flex-col items-center w-[70px] text-center">
                        <button className="p-1.5 bg-gray-300 text-2xl hover:opacity-80 rounded-full">
                            <FaUserCircle />
                        </button>
                        <p className="text-sm">Trang cá nhân</p>
                    </div>

                    <div className="flex flex-col items-center w-[70px] text-center">
                        <button className="p-1.5 bg-gray-300 text-2xl hover:opacity-80 rounded-full">
                            <BsFillBellFill />
                        </button>
                        <p className="text-sm">Tắt thông báo</p>
                    </div>

                    <div className="flex flex-col items-center w-[70px] text-center">
                        <button className="p-1.5 bg-gray-300 text-2xl hover:opacity-80 rounded-full">
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
                                className="flex justify-between w-full p-2 py-3 text-left text-md font-medium 
                                text-gray-800 rounded-lg hover:bg-gray-100"
                            >
                                {section.title}
                                <span
                                    className={`transform transition-transform duration-300 
                                    ${openIndices.includes(index) ? 'rotate-180' : 'rotate-0'
                                        }`}>
                                    <IoIosArrowDown />
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-[max-height] duration-300 ease-in-out 
                                ${openIndices.includes(index) ? 'max-h-60' : 'max-h-0'
                                    }`}>
                                <div className="">{section.content}</div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <div className={`flex flex-col gap-4 w-[33%] min-h-[96vh] max-h-[96vh] overflow-y-auto 
                bg-white p-1 pb-0 rounded-xl border border-gray-200 shadow-sm transition-transform duration-300 
                ${isAnimating ? (animationDirection === 'right' ? 'translate-x-full' : '-translate-x-full') : ''}`}
            >
                <div className="flex items-center gap-2 p-2">
                    <button className="flex items-center gap-2 p-2 text-left text-lg font-medium 
                        text-gray-800 rounded-full hover:bg-gray-100"
                        onClick={() => handleTabChange('default')}>
                        <FaArrowLeft />
                    </button>
                    <p className="text-lg font-semibold">File phương tiện, file và liên kết</p>
                </div>

                <div className="flex justify-between border-b">
                    <button
                        className={`p-2 flex-1 text-center ${activeTab === 'media' ? 'font-semibold border-b-2 border-blue-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('media')}
                    >
                        Phương tiện
                    </button>
                    <button
                        className={`p-2 flex-1 text-center ${activeTab === 'files' ? 'font-semibold border-b-2 border-blue-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('files')}
                    >
                        Tệp
                    </button>
                    <button
                        className={`p-2 flex-1 text-center ${activeTab === 'links' ? 'font-semibold border-b-2 border-blue-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('links')}
                    >
                        Liên kết
                    </button>
                </div>

                <div className="p-4 overflow-y-auto">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}

export default ConversationInfo;


