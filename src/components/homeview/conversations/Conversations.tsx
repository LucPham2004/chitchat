import { BsPencilSquare } from "react-icons/bs";
import ConversationList from "./ConversationList";
import '../../../styles/scrollbar.css';
import SearchBar from "./SearchBar";
import { useState } from "react";
import { IoSettings } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

const Conversations = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden min-w-full flex flex-col items-center bg-white 
            p-2 pb-0 rounded-xl border border-gray-200 shadow-sm">

            <div className="flex flex-row items-center p-2 py-0 self-start w-full">
                <h2 className="flex self-start text-2xl font-bold text-left text-gray-800 w-[35%]"> Đoạn chat </h2>
                <div className="relative flex flex-row gap-4 items-center justify-end w-[65%]">
                    <button className="p-2 rounded-full text-black text-xl bg-gray-100 hover:bg-gray-200">
                        <BsPencilSquare />
                    </button>
                    <button className="rounded-full text-black"
                            onClick={toggleMenu}>
                        <img src="/avatar.jpg" className="w-8 h-8 rounded-full"/>
                    </button>

                    {isMenuOpen && (
                            <div className="absolute top-8 right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                                <ul className="text-gray-700 p-1">
                                    <Link to={"/profile"}>
                                        <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold hover:bg-gray-100 cursor-pointer">
                                            <img src="/avatar.jpg" className="w-8 h-8 rounded-full"/>
                                            Cristiano Ronaldo
                                        </li>
                                    </Link>
                                    <hr></hr>
                                    <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold hover:bg-gray-100 cursor-pointer">
                                        <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-200">
                                            <IoSettings />
                                        </button>
                                        Cài đặt
                                    </li>
                                    <hr></hr>
                                    <li className="flex items-center gap-4 px-2 py-2 mt-1 mb-1 rounded-lg font-bold hover:bg-gray-100 cursor-pointer">
                                        <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-200">
                                            <FiLogOut />
                                        </button>
                                        Đăng xuất
                                    </li>
                                </ul>
                            </div>
                        )}
                </div>
            </div>

            <div className="flex flex-col items-center w-full h-full p-2">
                <SearchBar />
            </div>

            <div className="flex flex-col items-center w-full h-full py-1 overflow-y-auto">
                <ConversationList />
            </div>
        </div>
    );
}

export default Conversations;

