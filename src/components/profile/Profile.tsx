import { IoCamera, IoChatbubblesSharp, IoClose, IoLogoYoutube, IoSettings } from "react-icons/io5";
import { PiHandWavingFill, PiUploadSimpleFill } from "react-icons/pi";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaArrowLeft, FaArrowRight, FaCameraRetro, FaDiscord, FaFacebook, FaGithub, FaInstagramSquare, FaLinkedin, FaTiktok } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import useDeviceTypeByWidth from "../../utilities/useDeviceTypeByWidth";
import { useTheme } from "../../utilities/ThemeContext";
import SocialLinkButton from "../common/SocialLinkButton";
import { useAuth } from "../../utilities/AuthContext";
import { Account, GetAccount } from "../../types/backend";
import { AxiosError } from "axios";
import { callFetchAccount } from "../../services/AuthService";
import { getOtherUserById, getUserById, getUserFriends, updateUser, updateUserImages } from "../../services/UserService";
import { Gender, UserDTO, UserImageUpdateReq, UserResponse, UserUpdateRequest } from "../../types/User";
import { uploadUserImage } from "../../services/ImageService";
import Avatar from "../common/Avatar";

interface User {
    id: number;
    name: string;
    avatar: string;
}

const LOCAL_STORAGE_KEY = 'user_account';

const Profile = () => {
    const { user } = useAuth();
    const { user_id_param } = useParams();
    const deviceType = useDeviceTypeByWidth();
    const { isDarkMode } = useTheme();

    const [showMenu, setShowMenu] = useState(false);
    const [inputUrl, setInputUrl] = useState("");
    const [EditProfileModal, setEditProfileModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user?.user.avatarUrl ? user?.user.avatarUrl : null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const [userAccount, setUserAccount] = useState<UserResponse | null>(null);
    const [userProfile, setUserProfile] = useState<UserResponse | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [bio, setBio] = useState("");
    const [job, setJob] = useState("");
    const [location, setLocation] = useState("");

    const [friends, setFriends] = useState<UserDTO[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const isMountedRef = useRef(true);

    const fetchUser = async () => {
        try {
            if (user?.user.id && user_id_param) {
                setLoading(true);
                const response = await getOtherUserById(user?.user.id, parseInt(user_id_param));
                console.log(response);
                const friendResponse = await getUserFriends(user.user.id, 0);
                setFriends(friendResponse.result?.content || []);
                if (response.result) {
                    if (parseInt(user_id_param) == user?.user.id) {
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(response.result));
                        setUserAccount(response.result);
                        localStorage.setItem("user_profile", JSON.stringify(response.result));
                        setUserProfile(response.result);
                    } else {
                        localStorage.setItem("user_profile", JSON.stringify(response.result));
                        setUserProfile(response.result);
                    }
                } else {
                    throw new Error("User response result is undefined");
                }

                if (!isMountedRef.current) return;
            } else {
                throw new Error("User ID is undefined");
            }
        } catch (error) {
            if (!isMountedRef.current) return;
        } finally {
            if (!isMountedRef.current) return;
            setLoading(false);
        }
    };

    useEffect(() => {
        isMountedRef.current = true; // Đánh dấu là component đang mounted

        const fetchData = async () => {
            const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
            const storedProfile = localStorage.getItem("user_profile");
            if (storedUser && storedUser !== "undefined" && user_id_param && parseInt(user_id_param) == user?.user.id) {
                setUserAccount(JSON.parse(storedUser));
                setLoading(false);
            }
            if (storedProfile && storedProfile !== "undefined" && user_id_param && parseInt(user_id_param) != user?.user.id) {
                setUserProfile(JSON.parse(storedProfile));
                setLoading(false);
            } else {
                await fetchUser();
            }
        };

        fetchData();

        return () => {
            isMountedRef.current = false; // Cleanup khi component unmount
        };
    }, []);

    useEffect(() => {
        fetchUser();
    }, [user_id_param]);

    useEffect(() => {
        if (userProfile?.firstName && userProfile?.lastName) {
            document.title = `${userProfile.firstName} ${userProfile.lastName}`;
        } else {
            document.title = "Chit Chat";
        }
    }, [userProfile]);

    if (loading) return (
        <div className={`min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex items-center justify-center
            pb-0 rounded-xl border shadow-sm overflow-y-auto
            ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className={`min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex items-center justify-center
            pb-0 rounded-xl border shadow-sm overflow-y-auto
            ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>
            <p className="text-red-500 text-lg font-semibold">Lỗi tải dữ liệu, xin vui lòng thử lại sau</p>
        </div>
    );



    const goBack = () => {
        navigate(-1);
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            if (user?.user.id) {
                const request: UserUpdateRequest = {
                    id: user?.user.id,
                    firstName,
                    lastName,
                    dob: dob ? new Date(dob) : undefined,
                    gender: gender || undefined,
                    bio,
                    location,
                    job
                };
                console.log("Request:", request);

                const response = await updateUser(request);
                handleUpdateImages(true);
                if (response.result) {
                    alert("Cập nhật thành công!");
                    setUserProfile(response.result);
                    setUserAccount(response.result);
                    setEditProfileModal(false);
                } else {
                    alert("Cập nhật thất bại!");
                }
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };


    const handleUpdateImages = async (isUpdateAvatar: boolean) => {
        try {
            if (!selectedFile || !userAccount) return;

            const uploadResult = await uploadUserImage(selectedFile, user?.user.id ? user.user.id : userAccount.id);

            // if isUpdateAvatar == true -> update avatar
            // else -> update cover photo            
            const request: UserImageUpdateReq = isUpdateAvatar ? {
                id: userAccount.id,
                avatarPublicId: uploadResult.public_id,
                avatarUrl: uploadResult.secure_url,
            } : {
                id: userAccount.id,
                coverPhotoPublicId: uploadResult.public_id,
                coverPhotoUrl: uploadResult.secure_url,
            };

            const response = await updateUserImages(request);
            console.log("Cập nhật thành công:", response);

            // Cập nhật UI nếu cần
            setEditProfileModal(false);
            await fetchUser();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        }
    };

    return (
        <div className={`min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex
            pb-0 rounded-xl border shadow-sm overflow-y-auto
            ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>
            <div className="relative flex flex-col w-full min-h-full">
                <div className="absolute top-3 left-4 z-10">
                    <button className={`p-2 rounded-full text-xl
                    ${isDarkMode ? 'text-gray-200 bg-[#474747] hover:bg-[#5A5A5A]'
                            : 'text-black bg-gray-200 hover:bg-gray-100'}`}
                        onClick={goBack}>
                        <FaArrowLeft />
                    </button>
                </div>

                <div className="w-full h-[300px] relative self-start">
                    {/* Ảnh bìa */}
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <img
                            src={userProfile?.coverPhotoUrl}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Ảnh đại diện */}
                    <div className={`absolute bottom-0 left-8 rounded-full transform translate-y-1/2 border-4
                            ${isDarkMode ? 'border-[#1F1F1F]' : 'border-white'}`}>

                        <Avatar avatarUrl={userProfile?.avatarUrl || '/user_default.avif'} width={40} height={40}></Avatar>
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
                                        onClick={() => handleUpdateImages(false)}
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
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-3xl font-bold`}>{userProfile?.firstName + " " + userProfile?.lastName}</p>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-md`}>{userProfile?.job ? userProfile?.job : userProfile?.friendNum + " bạn bè"}</p>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-md`}>{userProfile?.location || userProfile?.dob}</p>
                        </div>

                        {deviceType == 'PC' &&
                            <div className="flex flex-row gap-4 items-center justify-center max-w-[30%] max-h-[136px]">
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center text-xl font-satisfy`}>
                                    {userProfile?.bio}
                                </p>
                            </div>
                        }

                        {user_id_param && parseInt(user_id_param) != user?.user.id ? (
                            <div className="flex flex-col items-end gap-2 pt-4">
                                <Link to={`/conversations/${userProfile?.conversationId}`}>
                                    <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit  
                                            ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                            ${isDarkMode ? 'border-white bg-[#1F1F1F] text-blue-400'
                                            : 'border-black bg-white text-blue-700 '} border-2 border-blue-700
                                            hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                            rounded-full shadow-md transition duration-200`}>
                                        <IoChatbubblesSharp />
                                        <p className="font-semibold">Gửi tin nhắn</p>
                                    </button>
                                </Link>
                                <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit  
                                        ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                        ${isDarkMode ? 'border-white bg-[#1F1F1F] text-blue-400'
                                        : 'border-black bg-white text-blue-700 '} border-2 border-blue-700
                                        hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                        rounded-full shadow-md transition duration-200`}>
                                    <PiHandWavingFill />
                                    <p className="font-semibold px-0.5">Gửi kết bạn</p>
                                </button>
                            </div>
                        )
                            : (
                                <div className="flex flex-col items-end gap-2 pt-4">
                                    <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit  
                                ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                ${isDarkMode ? 'border-white' : 'border-black'}
                                border-2 border-black text-white bg-black 
                                hover:bg-gradient-to-r from-white to-gray-200 hover:text-black 
                                shadow-md transition duration-200`}
                                        onClick={() => setEditProfileModal(true)}>
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
                            )}
                    </div>
                </div>

                <div className={`flex items-center justify-between gap-8 px-8 py-2
                    ${deviceType !== 'PC' ? 'flex-col' : 'flex-row'} `}>

                    {deviceType !== 'PC' &&
                        <div className="flex flex-row gap-4 items-center justify-center max-w-[80%] max-h-[136px]">
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center text-xl font-satisfy`}>
                                {userProfile?.bio}
                            </p>
                        </div>
                    }

                    <div className={`flex flex-col items-start justify-between gap-3 max-w-[420px] p-2 rounded-xl 
                         border-2 
                        ${isDarkMode ? 'text-gray-300 bg-[#1F1F1F] border-gray-400' : 'bg-blue-50 border-blue-400'}`}>
                        <p className="font-semibold">Bạn có tổng cộng {userProfile?.friendNum} người bạn</p>
                        <div className="flex items-center -space-x-2">
                            {friends.map((user) => (
                                <div key={user.id} className="relative group">
                                    <img
                                        src={user.avatarUrl ? user.avatarUrl : '/user_default.avif'}
                                        alt={user.firstName}
                                        className="w-10 h-10 rounded-full border-2 border-white cursor-pointer 
                                        hover:scale-105 transition-transform"
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 
                                        text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 
                                        transition-opacity w-max">
                                        {user.firstName + " " + user.lastName}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            {friends.length > 2 && (
                                <p>{friends[0].firstName + " " + friends[0].lastName + ", " + friends[1].firstName + " " + friends[1].lastName + `${friends.length - 2 > 0 ? " và " + `${friends.length - 2}` + " người khác" : ''}`}</p>
                            )}
                            <Link to={`/profile/${user_id_param}/friends`}>
                                <button className={`flex gap-2 items-center text-md min-w-max h-10 border-2 
                                rounded-full shadow-md transition duration-200 px-3
                                ${isDarkMode
                                        ? 'border-white text-gray-300 bg-[#1F1F1F] hover:border-blue-400 hover:text-blue-400'
                                        : 'border-black text-black bg-white hover:bg-gradient-to-r from-black to-gray-800 hover:text-white'
                                    }`}>
                                    <p>Bạn bè</p>
                                    <FaArrowRight />
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-row gap-3 justify-evenly flex-wrap max-w-[300px]">
                        <div className="w-[60px] flex items-center justify-center">
                            <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-blue-600 text-blue-600 
                                    hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                                    rounded-full shadow-md transition duration-200
                                    ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
                                <FaFacebook />

                            </button>
                        </div>
                        <div className="w-[60px] flex items-center justify-center">
                            <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-pink-600 text-pink-500 
                                    hover:bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:text-white 
                                    rounded-full shadow-md transition duration-200
                                    ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
                                <FaInstagramSquare />

                            </button>
                        </div>
                        <div className="w-[60px] flex items-center justify-center">
                            <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-blue-600 text-blue-600 
                                    hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                                    rounded-full shadow-md transition duration-200
                                    ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
                                <FaLinkedin />

                            </button>
                        </div>
                        <div className="w-[60px] flex items-center justify-center">
                            <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl border-2
                                    hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                                    rounded-full shadow-md transition duration-200
                                    ${isDarkMode ? 'bg-[#1F1F1F] text-gray-400 border-gray-600 hover:border-gray-300'
                                    : 'bg-white text-gray-700 border-gray-700'}`}>
                                <FaTiktok />

                            </button>
                        </div>
                        <div className="w-[60px] flex items-center justify-center">
                            <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-blue-600 text-blue-600 
                                    hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                                    rounded-full shadow-md transition duration-200
                                    ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
                                <FaXTwitter />

                            </button>
                        </div>
                        <div className="w-[60px] flex items-center justify-center">
                            <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-red-500 text-red-500 
                                    hover:bg-gradient-to-r from-red-500 to-red-600 hover:text-white 
                                    rounded-full shadow-md transition duration-200
                                    ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
                                <IoLogoYoutube />

                            </button>
                        </div>
                        <div className="w-[60px] flex items-center justify-center">
                            <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                    border-2 border-blue-700 text-blue-700 
                                    hover:bg-gradient-to-r from-blue-600 to-blue-700 hover:text-white 
                                    rounded-full shadow-md transition duration-200
                                    ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
                                <FaDiscord />

                            </button>
                        </div>
                        <div className="w-[60px] flex items-center justify-center">
                            <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl border-2 
                                    hover:bg-gradient-to-r from-gray-700 to-gray-800 hover:text-white 
                                    rounded-full shadow-md transition duration-200
                                    ${isDarkMode ? 'bg-[#1F1F1F] text-gray-400 border-gray-600 hover:border-gray-300'
                                    : 'bg-white text-gray-700 border-gray-700'}`}>
                                <FaGithub />

                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {EditProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`relative p-6 rounded-xl shadow-lg w-[600px] 
                            ${isDarkMode ? "bg-[#1F1F1F] text-gray-300" : "bg-white text-black"}`}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-center">Cập nhật thông tin cá nhân</h2>

                        <div className="flex items-center justify-center space-x-2 w-full">
                            {/* Ảnh đại diện */}
                            <div className="w-60 flex flex-col items-center justify-center">
                                {previewUrl ? (
                                    <div className="relative w-32 h-32 rounded-full mx-auto mb-4 cursor-pointer" onClick={handleCameraClick}>
                                        <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
                                        <div className="absolute top-4 right-4 opacity-0 text-4xl text-gray-800 hover:opacity-60 
                                            rounded-full p-8 bg-gray-300">
                                            <IoCamera />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`w-32 h-32 text-4xl rounded-full mx-auto mb-4 flex items-center justify-center cursor-pointer 
                                            ${isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"}`}
                                        onClick={handleCameraClick}
                                    >
                                        <span className="rounded-full p-8 bg-gray-300">
                                            <IoCamera />
                                        </span>
                                    </div>
                                )}
                                <p>Ảnh đại diện</p>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                            </div>

                            {/* Form cập nhật thông tin */}
                            <div className="space-y-3 w-full">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder={userAccount?.firstName}
                                        className={`w-full p-2 border rounded-md 
                                            ${isDarkMode ? "bg-[#1F1F1F] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder={userAccount?.lastName}
                                        className={`w-full p-2 border rounded-md 
                                            ${isDarkMode ? "bg-[#1F1F1F] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="date"
                                        className={`w-full p-2 border rounded-md 
                                            ${isDarkMode ? "bg-[#1F1F1F] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                    <select
                                        className={`w-full p-2 border rounded-md 
                                            ${isDarkMode ? "bg-[#1F1F1F] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                        <option value="Other">Khác</option>
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    placeholder={userAccount?.bio ? userAccount?.bio : "Tiểu sử (bio)"}
                                    className={`w-full p-2 border rounded-md 
                                        ${isDarkMode ? "bg-[#1F1F1F] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder={userAccount?.job ? userAccount?.job : "Nghề nghiệp"}
                                    className={`w-full p-2 border rounded-md 
                                        ${isDarkMode ? "bg-[#1F1F1F] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                    value={job}
                                    onChange={(e) => setJob(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder={userAccount?.location ? userAccount?.location : "Nơi sinh sống"}
                                    className={`w-full p-2 border rounded-md 
                                        ${isDarkMode ? "bg-[#1F1F1F] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Nút cập nhật */}
                        <div className="flex justify-center space-x-2 mt-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                onClick={handleUpdateProfile}
                            >
                                Cập nhật
                            </button>
                        </div>

                        {/* Nút đóng modal */}
                        <button
                            className={`absolute top-4 right-4 text-2xl font-semibold rounded-full p-1 
                                ${isDarkMode ? "text-white bg-[#474747] hover:bg-[#5A5A5A]"
                                    : "text-black bg-gray-100 hover:bg-gray-200"}`}
                            onClick={() => {
                                setEditProfileModal(false);
                            }}
                        >
                            <IoClose />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Profile;


