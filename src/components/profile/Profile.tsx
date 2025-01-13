import { BsPencilSquare } from "react-icons/bs";
import { IoChatbubblesSharp, IoLogoYoutube, IoSettings } from "react-icons/io5";
import { PiHandWavingFill, PiUploadSimpleFill } from "react-icons/pi";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaArrowLeft, FaArrowRight, FaCameraRetro, FaDiscord, FaEdit, FaFacebook, FaGithub, FaInstagramSquare, FaLinkedin, FaTiktok } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import useDeviceTypeByWidth from "../../utilities/useDeviceTypeByWidth";
import { useTheme } from "../../utilities/ThemeContext";
import SocialLinkButton from "../common/SocialLinkButton";

interface User {
    id: number;
    name: string;
    avatar: string;
}

const Profile = () => {
    const deviceType = useDeviceTypeByWidth();
    const { isDarkMode } = useTheme();
    const [showMenu, setShowMenu] = useState(false);
    const [inputUrl, setInputUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    const users: User[] = [
        { id: 1, name: 'Alice', avatar: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29' },
        { id: 2, name: 'Bob', avatar: 'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0' },
        { id: 3, name: 'Charlie', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a' },
        { id: 4, name: 'David', avatar: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70' },
        { id: 5, name: 'Emma', avatar: 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8' },
        { id: 6, name: 'Charlie', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a' },
        { id: 7, name: 'David', avatar: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70' },
        { id: 8, name: 'Emma', avatar: 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8' },
        { id: 9, name: 'Charlie', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a' },
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpdate = async () => {
        try {
            // let newImageUrl = imageUrl;

            // if (selectedFile) {
            //     const uploadResult = await uploadGroupImage(selectedFile, groupId);
            //     newImageUrl = uploadResult.secure_url;
            // } else if (inputUrl.trim() !== "") {
            //     newImageUrl = inputUrl;
            // }

            // const groupResponse = await editGroup({
            //     groupId,
            //     adminId,
            //     name: group?.name,
            //     imageUrl: newImageUrl,
            //     privacy: GroupPrivacy.PUBLIC
            // });
            // console.log(groupResponse);

            // // 3. Cập nhật giao diện
            // setImageUrl(newImageUrl);
            // setInputUrl("");
            // setSelectedFile(null);
            // setShowMenu(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật nhóm:", error);
        }
    };

    return (
        <div className={`min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex
            pb-0 rounded-xl border shadow-sm overflow-y-auto
            ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>
            <div className="relative flex flex-col w-full min-h-full">
                <div className="absolute top-3 left-4 z-10">
                    <button className="p-2 rounded-full text-black text-xl border border-gray-500
                        bg-gray-200 hover:bg-gray-100"
                        onClick={goBack}>
                        <FaArrowLeft />
                    </button>
                </div>

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
                            className={`w-40 h-40 rounded-full border-4 object-cover
                                ${isDarkMode ? 'border-[#1F1F1F]' : 'border-white'}`}
                        />
                    </div>

                    <div className="absolute right-2 bottom-2">
                        {!showMenu ? (
                            <button
                                onClick={() => setShowMenu(true)}
                                className="items-center text-xl bg-[#e4e6eba0] hover:bg-[#d8dadfcd] p-3 rounded-full"
                            >
                                <FaCameraRetro />
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2 text-sm bg-white w-64 shadow-md p-2 rounded-lg">
                                {/* Tải ảnh lên */}
                                <div className="w-full p-2 rounded-md hover:bg-gray-200 text-black cursor-pointer">
                                    <label className="flex flex-row gap-2 items-center cursor-pointer">
                                        <PiUploadSimpleFill />
                                        <span className="text-black font-semibold">Tải ảnh lên</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                <div className="w-full p-2 rounded-md hover:bg-gray-200 text-black">
                                    <input
                                        type="text"
                                        placeholder="Nhập URL ảnh"
                                        value={inputUrl}
                                        onChange={(e) => setInputUrl(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                {/* Nhập URL ảnh */}
                                <div className="flex flex-row gap-2">
                                    <button
                                        onClick={handleUpdate}
                                        className="bg-blue-100 text-blue-500 w-[70%] p-2 rounded-md hover:bg-blue-200"
                                    >
                                        Cập nhật
                                    </button>
                                    <button
                                        onClick={() => setShowMenu(false)}
                                        className="bg-blue-100 text-blue-500 w-[30%] p-2 rounded-md hover:bg-blue-200"
                                    >
                                        Huỷ
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <div className={`flex ${deviceType == 'Mobile' ? 'flex-col' : 'flex-row'} justify-between p-8 pb-2`}>
                        <div className={`flex flex-col items-start mt-12 
                            ${deviceType == 'PC' ? 'max-w-[25%]' :
                                deviceType == 'Mobile' ? 'max-w-[100%]' : 'max-w-[60%]'
                            } `}>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-2xl font-bold`}>Sasha Watkinson</p>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>Sofware Developer</p>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>Hà Nội, Việt Nam</p>
                        </div>

                        {deviceType == 'PC' &&
                            <div className="flex flex-row gap-4 items-center justify-center max-w-[30%] max-h-[136px]">
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center text-xl font-satisfy`}>
                                    Money doesn't buy happiness, it buys CRAZY-ASS happiness!
                                </p>
                            </div>
                        }

                        <div className="flex flex-col items-end gap-2 pt-4">
                            {/* <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit  
                                ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                ${isDarkMode ? 'border-white bg-[#1F1F1F] text-blue-400' 
                                    : 'border-black bg-white text-blue-700 '} border-2 border-blue-700
                                hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                rounded-full shadow-md transition duration-200`}>
                                <IoChatbubblesSharp />
                                <p className="font-semibold">Gửi tin nhắn</p>
                            </button>
                            <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit  
                                ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                ${isDarkMode ? 'border-white bg-[#1F1F1F] text-blue-400' 
                                    : 'border-black bg-white text-blue-700 '} border-2 border-blue-700
                                hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                rounded-full shadow-md transition duration-200`}>
                                <PiHandWavingFill />
                                <p className="font-semibold px-0.5">Gửi kết bạn</p>
                            </button> */}
                            <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit  
                                ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                ${isDarkMode ? 'border-white' : 'border-black'}
                                border-2 border-black text-white bg-black 
                                hover:bg-gradient-to-r from-white to-gray-200 hover:text-black 
                                 shadow-md transition duration-200`}>
                                <BiSolidEditAlt />
                                <p className="font-semibold">Chỉnh sửa</p>
                            </button>
                            <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit 
                                ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                ${isDarkMode ? 'border-white' : 'border-black'}
                                border-2 border-black text-black bg-white 
                                hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                                rounded-full shadow-md transition duration-200`}>
                                <IoSettings />
                                <p className="font-semibold px-0.5">Cài đặt</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`flex items-center justify-between gap-8 px-8 py-2
                    ${deviceType !== 'PC' ? 'flex-col' : 'flex-row'} `}>

                    {deviceType !== 'PC' &&
                        <div className="flex flex-row gap-4 items-center justify-center max-w-[80%] max-h-[136px]">
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center text-xl font-satisfy`}>
                                Money doesn't buy happiness, it buys CRAZY-ASS happiness!
                            </p>
                        </div>
                    }

                    <div className={`flex flex-col items-start justify-between gap-3 max-w-[420px] p-2 rounded-xl 
                         border-2 
                        ${isDarkMode ? 'text-gray-300 bg-[#1F1F1F] border-gray-400' : 'bg-blue-50 border-blue-400'}`}>
                        <p className="font-semibold">Bạn có tổng cộng 953 người bạn</p>
                        <div className="flex items-center -space-x-2">
                            {users.map((user) => (
                                <div key={user.id} className="relative group">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full border-2 border-white cursor-pointer 
                                        hover:scale-105 transition-transform"
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 
                                        text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 
                                        transition-opacity">
                                        {user.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <p>Lionel Messi, Neymar.JR, Benzema và 950 người khác</p>
                            <Link to={"/profile/friends"}>
                                <button className={`flex gap-2 items-center text-md min-w-max h-12 border-2 
                                rounded-full shadow-md transition duration-200 py-2 px-3
                                ${isDarkMode
                                        ? 'border-white text-black bg-white hover:bg-gradient-to-r from-blue-500 to-blue-400 hover:text-white'
                                        : 'border-black text-black bg-white hover:bg-gradient-to-r from-black to-gray-800 hover:text-white'
                                    }`}>
                                    <p>Tất cả</p>
                                    <FaArrowRight />
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-start gap-2 p-2 rounded-xl ">
                        <div className="flex flex-row gap-3 justify-evenly flex-wrap max-w-[300px]">
                            <SocialLinkButton
                                icon={<FaFacebook />}
                                textColor="blue-600"
                                borderColor="blue-600"
                                bgColorFrom="blue-500"
                                bgColorTo="blue-600"
                            />

                            <SocialLinkButton
                                icon={<FaInstagramSquare />}
                                textColor="pink-500"
                                borderColor="pink-600"
                                bgColorFrom="pink-500"
                                bgColorTo="yellow-500"
                            />

                            <SocialLinkButton
                                icon={<FaLinkedin />}
                                textColor="blue-600"
                                borderColor="blue-600"
                                bgColorFrom="blue-500"
                                bgColorTo="blue-600"
                            />

                            <SocialLinkButton
                                icon={<FaTiktok />}
                                textColor="gray-400"
                                borderColor="gray-400"
                                bgColorFrom="black"
                                bgColorTo="gray-800"
                            />

                            <SocialLinkButton
                                icon={<FaXTwitter />}
                                textColor="blue-600"
                                borderColor="blue-600"
                                bgColorFrom="blue-500"
                                bgColorTo="blue-600"
                            />

                            <SocialLinkButton
                                icon={<IoLogoYoutube />}
                                textColor="red-500"
                                borderColor="red-500"
                                bgColorFrom="red-500"
                                bgColorTo="red-600"
                            />

                            <SocialLinkButton
                                icon={<FaDiscord />}
                                textColor="blue-700"
                                borderColor="blue-700"
                                bgColorFrom="blue-600"
                                bgColorTo="blue-700"
                            />

                            <SocialLinkButton
                                icon={<FaGithub />}
                                textColor="gray-400"
                                borderColor="gray-400"
                                bgColorFrom="gray-700"
                                bgColorTo="gray-800"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;


