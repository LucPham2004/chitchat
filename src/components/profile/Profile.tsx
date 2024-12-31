import { BsPencilSquare } from "react-icons/bs";
import { IoChatbubblesSharp, IoLogoYoutube, IoSettings } from "react-icons/io5";
import { PiHandWavingFill } from "react-icons/pi";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaFacebook, FaInstagramSquare, FaTiktok } from "react-icons/fa";


const Profile = () => {

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex bg-white
            pb-0 rounded-xl border border-gray-200 shadow-sm overflow-y-auto">
            <div className="flex flex-col w-full min-h-full">

                <div className="w-full h-[300px] relative self-start">
                    {/* Ảnh bìa */}
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <img
                            src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Ảnh đại diện */}
                    <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70"
                            alt="Profile"
                            className="w-40 h-40 rounded-full border-4 border-white object-cover"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex flex-row justify-between p-8 pb-2">
                        <div className="flex flex-col items-start mt-12 max-w-[25%]">
                            <h2 className="text-2xl font-bold text-gray-800 font-sans">Cristiano Ronaldo</h2>
                            <p className="text-lg text-gray-600 font-serif">Sofware Developer</p>
                            <p className="text-lg text-gray-600 font-serif">Hà Nội, Việt Nam</p>
                        </div>

                        <div className="flex flex-row gap-4 items-center justify-center max-w-[30%] max-h-[136px]">
                            <p className="text-center text-xl font-satisfy">Money doesn't buy happiness, it buys CRAZY-ASS happiness!</p>
                        </div>

                        <div className="flex flex-col items-end gap-2 pt-4">
                            <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                                border-2 border-blue-700 text-blue-700 bg-white 
                                hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                rounded-full shadow-md transition duration-300">
                                <IoChatbubblesSharp />
                                <p className="font-semibold">Gửi tin nhắn</p>
                            </button>
                            <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                                border-2 border-blue-700 text-blue-700 bg-white 
                                hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                rounded-full shadow-md transition duration-300">
                                <PiHandWavingFill />
                                <p className="font-semibold px-0.5">Gửi kết bạn</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-between px-8 py-2">

                    <div className="flex flex-row items-start gap-4">
                        <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                            border-2 border-black text-white bg-black 
                            hover:bg-gradient-to-r from-white to-gray-200 hover:text-black 
                            rounded-full shadow-md transition duration-300">
                            <BiSolidEditAlt />
                            <p className="font-semibold">Chỉnh sửa</p>
                        </button>
                        <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                            border-2 border-black text-black bg-white 
                            hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                            rounded-full shadow-md transition duration-300">
                            <IoSettings />
                            <p className="font-semibold px-0.5">Cài đặt</p>
                        </button>
                    </div>

                    <div className="flex flex-row gap-4 items-center justify-end">
                        <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                            border-2 border-blue-600 text-blue-600 bg-white 
                            hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                            rounded-full shadow-md transition duration-300">
                            <FaFacebook />
                            <p className="font-semibold">Facebook</p>
                        </button>
                        <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                            border-2 border-pink-600 text-pink-500 bg-white 
                            hover:bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:text-white 
                            rounded-full shadow-md transition duration-300">
                            <FaInstagramSquare />
                            <p className="font-semibold">Instagram</p>
                        </button>
                        <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                            border-2 border-red-500 text-red-500 bg-white 
                            hover:bg-gradient-to-r from-red-500 to-red-600 hover:text-white 
                            rounded-full shadow-md transition duration-300">
                            <IoLogoYoutube />
                            <p className="font-semibold">Youtube</p>
                        </button>
                        <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                            border-2 border-black text-black bg-white 
                            hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                            rounded-full shadow-md transition duration-300">
                            <FaTiktok />
                            <p className="font-semibold">TikTok</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;


