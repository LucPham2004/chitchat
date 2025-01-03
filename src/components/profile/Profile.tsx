import { BsPencilSquare } from "react-icons/bs";
import { IoChatbubblesSharp, IoLogoYoutube, IoSettings } from "react-icons/io5";
import { PiHandWavingFill, PiUploadSimpleFill } from "react-icons/pi";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaArrowLeft, FaArrowRight, FaCameraRetro, FaDiscord, FaEdit, FaFacebook, FaGithub, FaInstagramSquare, FaLinkedin, FaTiktok } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";

interface User {
    id: number;
    name: string;
    avatar: string;
}

const Profile = () => {
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
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex bg-white
            pb-0 rounded-xl border border-gray-200 shadow-sm overflow-y-auto">
            <div className="relative flex flex-col w-full min-h-full">
                <div className="absolute top-4 left-4 z-10">
                    <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-100"
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
                            className="w-40 h-40 rounded-full border-4 border-white object-cover"
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

                <div>
                    <div className="flex flex-row justify-between p-8 pb-2">
                        <div className="flex flex-col items-start mt-12 max-w-[25%]">
                            <h2 className="text-2xl font-bold text-gray-800">Cristiano Ronaldo</h2>
                            <p className="text-lg text-gray-600">Sofware Developer</p>
                            <p className="text-lg text-gray-600">Hà Nội, Việt Nam</p>
                        </div>

                        <div className="flex flex-row gap-4 items-center justify-center max-w-[30%] max-h-[136px]">
                            <p className="text-center text-xl font-satisfy">
                                Money doesn't buy happiness, it buys CRAZY-ASS happiness!
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 pt-4">
                            {/* <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                               border-2 border-blue-700 text-blue-700 bg-white 
                                hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                rounded-full shadow-md transition duration-200">
                                <IoChatbubblesSharp />
                                <p className="font-semibold">Gửi tin nhắn</p>
                            </button>
                            <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                               border-2 border-blue-700 text-blue-700 bg-white 
                                hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                rounded-full shadow-md transition duration-200">
                                <PiHandWavingFill />
                                <p className="font-semibold px-0.5">Gửi kết bạn</p>
                            </button> */}
                            <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                                border-2 border-black text-white bg-black 
                                hover:bg-gradient-to-r from-white to-gray-200 hover:text-black 
                                rounded-full shadow-md transition duration-200">
                                <BiSolidEditAlt />
                                <p className="font-semibold">Chỉnh sửa</p>
                            </button>
                            <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit 
                                border-2 border-black text-black bg-white 
                                hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                                rounded-full shadow-md transition duration-200">
                                <IoSettings />
                                <p className="font-semibold px-0.5">Cài đặt</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-4 px-8 py-2">

                    <div className="flex flex-col items-start justify-between gap-2 max-w-[420px] p-2 rounded-xl 
                        bg-blue-50 border-2 border-blue-400">
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
                                <button className="flex gap-2 items-center text-md min-w-max h-12 border-2 
                                border-black text-black bg-white 
                                hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                                rounded-full shadow-md transition duration-200 py-2 px-3"
                                >
                                    <p>Tất cả</p>
                                    <FaArrowRight />
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-start gap-2 p-2 rounded-xl ">
                        <div className="flex flex-row gap-3 justify-evenly flex-wrap max-w-[300px]">
                            <div className="w-[60px] flex items-center justify-center">
                                <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-blue-600 text-blue-600 bg-white 
                                    hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                                    rounded-full shadow-md transition duration-200">
                                    <FaFacebook />
                                    
                                </button>
                            </div>
                            <div className="w-[60px] flex items-center justify-center">
                                <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-pink-600 text-pink-500 bg-white 
                                    hover:bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:text-white 
                                    rounded-full shadow-md transition duration-200">
                                    <FaInstagramSquare />
                                    
                                </button>
                            </div>
                            <div className="w-[60px] flex items-center justify-center">
                                <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-blue-600 text-blue-600 bg-white 
                                    hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                                    rounded-full shadow-md transition duration-200">
                                    <FaLinkedin />
                                    
                                </button>
                            </div>
                            <div className="w-[60px] flex items-center justify-center">
                                <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-black text-black bg-white 
                                    hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                                    rounded-full shadow-md transition duration-200">
                                    <FaTiktok />
                                    
                                </button>
                            </div>
                            <div className="w-[60px] flex items-center justify-center">
                                <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-blue-600 text-blue-600 bg-white 
                                    hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                                    rounded-full shadow-md transition duration-200">
                                    <FaXTwitter />
                                    
                                </button>
                            </div>
                            <div className="w-[60px] flex items-center justify-center">
                                <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-red-500 text-red-500 bg-white 
                                    hover:bg-gradient-to-r from-red-500 to-red-600 hover:text-white 
                                    rounded-full shadow-md transition duration-200">
                                    <IoLogoYoutube />
                                    
                                </button>
                            </div>
                            <div className="w-[60px] flex items-center justify-center">
                                <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-blue-700 text-blue-700 bg-white 
                                    hover:bg-gradient-to-r from-blue-600 to-blue-700 hover:text-white 
                                    rounded-full shadow-md transition duration-200">
                                    <FaDiscord />
                                    
                                </button>
                            </div>
                            <div className="w-[60px] flex items-center justify-center">
                                <button className="flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-gray-700 text-gray-700 bg-white 
                                    hover:bg-gradient-to-r from-gray-700 to-gray-800 hover:text-white 
                                    rounded-full shadow-md transition duration-200">
                                    <FaGithub />
                                    
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;


