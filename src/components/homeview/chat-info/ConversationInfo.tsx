import { FaUserCircle } from "react-icons/fa";
import { TiPin } from "react-icons/ti";
import { FaBell, FaImage, FaPenNib } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from 'react-icons/io';
import { ReactNode, useState } from "react";
import { PiTextAa } from "react-icons/pi";


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
              
            </div>
          ),
        },
        {
          title: 'File phương tiện, file và liên kết',
          content: (
            <ul>
              <li>Hình ảnh: 5</li>
              <li>Video: 2</li>
              <li>Tài liệu: 1</li>
            </ul>
          ),
        },
        {
          title: 'Quyền riêng tư và hỗ trợ',
          content: (
            <div>
              
            </div>
          ),
        }
      ];

    return (
        <div className="flex flex-col gap-4 w-[33%] min-h-[96vh] max-h-[96vh] overflow-y-auto 
            bg-white p-1 pb-0 rounded-xl shadow-sm">

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
                        <FaBell />
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
                                ${openIndices.includes(index) ? 'max-h-65' : 'max-h-0'
                        }`}>
                            <div className="">{section.content}</div>
                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default ConversationInfo;


