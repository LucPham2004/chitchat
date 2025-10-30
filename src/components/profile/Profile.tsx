import { IoCamera, IoChatbubblesOutline, IoChatbubblesSharp, IoClose, IoLogoYoutube, IoSettings } from "react-icons/io5";
import { PiHandWavingFill, PiUploadSimpleFill } from "react-icons/pi";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaArrowLeft, FaArrowRight, FaCameraRetro, FaDiscord, FaFacebook, FaGithub, FaInstagramSquare, FaLinkedin, FaTiktok, FaUserFriends } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import useDeviceTypeByWidth from "../../utilities/useDeviceTypeByWidth";
import { useTheme } from "../../utilities/ThemeContext";
import { useAuth } from "../../utilities/AuthContext";
import { getMutualFriends, getOtherUserById, getUserFriends, updateUser, updateUserImages } from "../../services/UserService";
import { UserDTO, UserUpdateImageRequest, UserResponse, UserUpdateRequest } from "../../types/User";
import { uploadUserImage } from "../../services/ImageService";
import Avatar from "../common/Avatar";
import { useChatContext } from "../../utilities/ChatContext";
import { sendFriendRequest } from "../../services/FriendshipService";
import { ROUTES } from "../../utilities/Constants";
import toast, { Toaster } from "react-hot-toast";


const LOCAL_STORAGE_KEY = 'user_account';

const Profile = () => {
    const { user } = useAuth();
    const { user_id_param } = useParams();
    const deviceType = useDeviceTypeByWidth();
    const { isDarkMode } = useTheme();

    const [showMenu, setShowMenu] = useState(false);
    const [inputUrl, setInputUrl] = useState("");
    const {setIsDisplayMedia} = useChatContext();
    const {setDisplayMediaUrl} = useChatContext();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user?.user.coverPhotoUrl ? user?.user.coverPhotoUrl : null);

    const navigate = useNavigate();

    const [userAccount, setUserAccount] = useState<UserResponse | null>(null);
    const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
    const [friends, setFriends] = useState<UserDTO[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const isMountedRef = useRef(true);

    const fetchUser = async () => {
        try {
            if (user?.user.id && user_id_param) {
                setLoading(true);
                const response = await getOtherUserById(user?.user.id, user_id_param);
                if (response.result) {
                    if (user_id_param == user?.user.id) {
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

                if(user_id_param == user.user.id) {
                    const friendResponse = await getUserFriends(user.user.id, 0);
                    setFriends(friendResponse.result?.content || []);
                } else {
                    const mutualFriendResponse = await getMutualFriends(user.user.id, user_id_param, 0);
                    setFriends(mutualFriendResponse.result?.content || []);
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

    // Tải dữ liệu khi component được mount và khi user_id_param thay đổi
    useEffect(() => {
        isMountedRef.current = true; // Đánh dấu là component đang mounted

        const fetchData = async () => {
            const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
            const storedProfile = localStorage.getItem("user_profile");
            if (storedUser && storedUser !== "undefined" && user_id_param && user_id_param == user?.user.id) {
                setUserAccount(JSON.parse(storedUser));
                setLoading(false);
            }
            if (storedProfile && storedProfile !== "undefined" && user_id_param && user_id_param != user?.user.id) {
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

    const toConversations = () => {
        navigate(ROUTES.MOBILE.CONVERSATIONS);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUpdateImages = async (isUpdateAvatar: boolean) => {
        try {
            if (!selectedFile || !userAccount) return;

            const uploadResult = await uploadUserImage(selectedFile, user?.user.id ? user.user.id : userAccount.id);

            // if isUpdateAvatar == true -> update avatar
            // else -> update cover photo            
            const request: UserUpdateImageRequest = isUpdateAvatar ? {
                id: userAccount.id,
                avatarPublicId: uploadResult.public_id,
                avatarUrl: uploadResult.secure_url,
            } : {
                id: userAccount.id,
                coverPhotoPublicId: uploadResult.public_id,
                coverPhotoUrl: uploadResult.secure_url,
            };

            const response = await updateUserImages(request);
            if(response.code == 1000) {
                console.log("Cập nhật thành công:", response);
                toast.success("Cập nhật ảnh thành công!");
            }
            setShowMenu(false);
            setInputUrl("");
            setSelectedFile(null);

            await fetchUser();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        }
    };

    const handleSendRequest = async (userId: string) => {
        try {
            console.log("clicked")
            if (!user) return;
            const res = await sendFriendRequest(user?.user.id, userId);
            if(res.code == 1000) {
                console.log("Yêu cầu kết bạn đã được gửi: ", res);
                toast.success("Cập nhật thông tin thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu kết bạn: ", error);
        }
    };

    if (loading) return (
        <div className={`min-h-[96dvh] max-h-[96dvh] overflow-hidden w-full flex items-center justify-center
            pb-0 rounded-xl border shadow-sm overflow-y-auto
            ${isDarkMode ? 'bg-[#161618] border-gray-900' : 'bg-white border-gray-200'}`}>
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className={`min-h-[96dvh] max-h-[96dvh] overflow-hidden w-full flex items-center justify-center
            pb-0 rounded-xl border shadow-sm overflow-y-auto
            ${isDarkMode ? 'bg-[#161618] border-gray-900' : 'bg-white border-gray-200'}`}>
            <p className="text-red-500 text-lg font-semibold">Lỗi tải dữ liệu, xin vui lòng thử lại sau</p>
        </div>
    );

    return (
        <div className={`overflow-hidden w-full flex
            pb-0 rounded-xl border shadow-sm overflow-y-auto
            ${deviceType !== 'Mobile' ? 'max-h-[96dvh] min-h-[96dvh]' : 'h-[100dvh]'}
            ${isDarkMode ? 'bg-[#161618] border-gray-900' : 'bg-white border-gray-200'}`}>
            <div className="relative flex flex-col w-full min-h-full">
                
                {/* 🔔 Toast */}
                <Toaster position="top-center" toastOptions={{
                    style: {
                    background: "#fff",
                    color: "#333",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    },
                }} />

                {deviceType != 'PC' && (
                <div className="absolute top-3 left-4 z-10">
                    <button className={`p-2 rounded-full text-xl
                    ${isDarkMode ? 'text-gray-200 bg-[#474747] hover:bg-[#5A5A5A]'
                            : 'text-black bg-gray-200 hover:bg-gray-100'}`}
                        onClick={toConversations}>
                        <IoChatbubblesOutline />
                    </button>
                </div>
                )}

                <div className="w-full h-[300px] relative self-start">
                    {/* Ảnh bìa */}
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <img
                            src={previewUrl ? previewUrl : userProfile?.coverPhotoUrl}
                            alt="Cover"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => {
                                setDisplayMediaUrl(userProfile?.coverPhotoUrl);
                                setIsDisplayMedia(true);
                            }}
                        />
                    </div>

                    {/* Ảnh đại diện */}
                    <div className={`absolute bottom-0 left-8 rounded-full transform translate-y-1/2 border-4 cursor-pointer
                            ${isDarkMode ? 'border-[#161618]' : 'border-white'}`}
                            onClick={() => {
                                setDisplayMediaUrl(userProfile?.avatarUrl);
                                setIsDisplayMedia(true);
                            }}>

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
                                        onClick={() => {
                                            setShowMenu(false);
                                            setInputUrl("");
                                            setSelectedFile(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="bg-blue-100 text-blue-500 w-[30%] p-2 rounded-md hover:bg-blue-200"
                                    >
                                        Huỷ
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="">
                    <div className={`flex ${deviceType == 'Mobile' ? 'flex-col' : 'flex-row'} justify-between p-8 pb-2`}>
                        <div className={`flex flex-col items-start mt-12 
                            ${deviceType == 'PC' ? 'max-w-[25%]' :
                                deviceType == 'Mobile' ? 'max-w-[100%]' : 'max-w-[60%]'
                            } `}>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-3xl font-bold`}>{userProfile?.firstName + " " + userProfile?.lastName}</p>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-md`}>{userProfile?.friendNum + " bạn bè"}</p>
                        </div>

                        {deviceType == 'PC' &&
                            <div className="flex flex-row gap-4 items-center justify-center max-w-[30%] max-h-[136px]">
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center text-xl font-satisfy`}>
                                    {userProfile?.bio}
                                </p>
                            </div>
                        }

                        {user_id_param && user_id_param != user?.user.id ? (
                            <div className="flex flex-col items-end gap-2 pt-4">
                                <Link to={`${deviceType == 'Mobile' 
                                    ? `${ROUTES.MOBILE.CONVERSATION(userProfile?.conversationId)}`
                                    : `${ROUTES.DESKTOP.CONVERSATION(userProfile?.conversationId)}`}`}
                                    className="w-full">
                                    <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit  
                                            ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                            ${isDarkMode ? 'border-white bg-[#161618] text-blue-400'
                                            : 'border-black bg-white text-blue-700 '} border-2 border-blue-700
                                            hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                            rounded-full shadow-md transition duration-200`}>
                                        <IoChatbubblesSharp />
                                        <p className="font-semibold">Gửi tin nhắn</p>
                                    </button>
                                </Link>

                                {friends.length > 0 && (
                                <Link to={`${deviceType == 'Mobile'
                                    ? `${ROUTES.MOBILE.PROFILE_FRIENDS(user_id_param)}`
                                    : `${ROUTES.DESKTOP.PROFILE_FRIENDS(user_id_param)}`}`}
                                    className="w-full min-w-[130px]">
                                    <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit min-w-[130px]
                                        ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                        ${isDarkMode ? 'border-white bg-[#161618] text-blue-400'
                                            : 'border-black bg-white text-blue-700 '} border-2 border-blue-700
                                            hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                            rounded-full shadow-md transition duration-200`}>
                                        <FaUserFriends />
                                        <p className="font-semibold px-0.5">Xem bạn chung</p>
                                    </button>
                                </Link>
                                )}

                                {!userProfile?.friend && (
                                <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit w-full
                                        ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                        ${isDarkMode ? 'border-white bg-[#161618] text-blue-400'
                                        : 'border-black bg-white text-blue-700 '} border-2 border-blue-700
                                        hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white 
                                        rounded-full shadow-md transition duration-200`}
                                        onClick={() => {
                                            if(userProfile != null) {
                                                handleSendRequest(userProfile?.id)
                                            }
                                        }}>
                                    <PiHandWavingFill />
                                    <p className="font-semibold px-0.5">Gửi kết bạn</p>
                                </button>
                                )}
                            </div>
                        )
                            : (
                                <div className="flex flex-col items-end gap-2 pt-4">
                                    <Link to={`${deviceType == 'Mobile'
                                        ? `${ROUTES.MOBILE.PROFILE_UPDATE(user_id_param)}`
                                        : `${ROUTES.DESKTOP.PROFILE_UPDATE(user_id_param)}`} `}
                                        className="w-full">
                                        <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit  
                                            ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                            ${isDarkMode 
                                                ? `border-white text-white bg-black 
                                                    hover:bg-gradient-to-r from-white to-gray-300 hover:text-black` 
                                                : `border-black text-black bg-white 
                                                    hover:bg-gradient-to-r from-black to-[#515151] hover:text-white`}
                                            border-2 shadow-md transition duration-200`}>
                                            <BiSolidEditAlt />
                                            <p className="font-semibold">Chỉnh sửa</p>
                                        </button>
                                    </Link>
                                    <Link to={`${deviceType == 'Mobile'
                                        ? `${ROUTES.MOBILE.PROFILE_FRIENDS(user_id_param)}`
                                        : `${ROUTES.DESKTOP.PROFILE_FRIENDS(user_id_param)}`}`}
                                        className="w-full min-w-[130px]">
                                        <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit min-w-[130px]
                                            ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                            ${isDarkMode 
                                                ? `border-white text-white bg-black 
                                                    hover:bg-gradient-to-r from-white to-gray-300 hover:text-black` 
                                                : `border-black text-black bg-white 
                                                    hover:bg-gradient-to-r from-black to-[#515151] hover:text-white`}
                                            border-2 shadow-md transition duration-200`}>
                                            <FaUserFriends />
                                            <p className="font-semibold px-0.5">Bạn bè</p>
                                        </button>
                                    </Link>
                                    {/* <Link to={`${deviceType == 'Mobile'
                                        ? `/mobile/profile/${user_id_param}/friends`
                                        : `/d/profile/${user_id_param}/friends`}`}
                                        className="w-full">
                                        <button className={`flex items-center justify-center gap-2 py-2 px-4 h-fit 
                                            ${deviceType == 'Mobile' ? 'w-full rounded-lg' : 'w-fit rounded-full'}
                                            ${isDarkMode ? 'border-white' : 'border-black'}
                                            border-2 border-black text-black bg-white 
                                            hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                                            rounded-full shadow-md transition duration-200`}>
                                            <FaUserFriends />
                                            <p className="font-semibold px-0.5">Bạn bè</p>
                                        </button>
                                    </Link> */}
                                </div>
                            )}
                    </div>
                </div>

                <div className={`flex items-center justify-between gap-8 md:px-8 py-2
                    ${deviceType !== 'PC' ? 'flex-col' : 'flex-row'} `}>

                    {deviceType !== 'PC' &&
                        <div className="flex flex-row gap-4 items-center justify-center max-w-[90%] max-h-[136px]">
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-center text-xl font-satisfy`}>
                                {userProfile?.bio}
                            </p>
                        </div>
                    }

                    <div className={`flex flex-col items-start justify-between gap-1 w-[80%] max-w-[360px] p-4 pb-4 rounded-xl border-2 
                        ${isDarkMode ? 'text-gray-300 bg-[#161618] border-gray-400' : 'bg-blue-50 border-blue-400'}`}>

                        <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-xl font-bold`}>Giới thiệu</p>

                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-md`}>{userProfile?.job ? `Nghề nghiệp: ${userProfile?.job}` : ""}</p>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-md`}>{userProfile?.location? `Nơi sống: ${userProfile?.location}` : ""}</p>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-md`}>{userProfile?.dob? `Ngày sinh: ${userProfile?.dob}` : ""}</p>
                        
                        {user_id_param && user_id_param == user?.user.id 
                        ? (
                            <p className="font-semibold">Bạn đã kết nối {userProfile?.friendNum} người bạn</p>
                        ) 
                        : (
                            <p className="font-semibold">Các bạn có {friends.length} bạn chung</p>
                        )}
                        {/* <div className="flex items-center -space-x-2">
                            {friends.map((user) => (
                                <div key={user.id} className="relative group">
                                    <img
                                        src={user.avatarUrl ? user.avatarUrl : '/user_default.avif'}
                                        alt={user.firstName}
                                        className="w-10 h-10 rounded-full border-2 border-white cursor-pointer object-cover
                                        hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 
                                        text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 
                                        transition-opacity w-max">
                                        {user.firstName + " " + user.lastName}
                                    </div>
                                </div>
                            ))}
                        </div> */}
                        {/* <div className="flex items-center gap-2">
                            {friends.length > 1 && (
                                <p>{friends[0].firstName + " " + friends[0].lastName + ", " + friends[1].firstName + " " + friends[1].lastName + `${friends.length - 2 > 0 ? " và " + `${friends.length - 2}` + " người khác" : ''}`}</p>
                            )}
                            <Link to={`${deviceType == 'Mobile'
                                ? `/mobile/profile/${user_id_param}/friends`
                                : `/d/profile/${user_id_param}/friends`}`}>
                                <button className={`flex gap-2 items-center text-md min-w-max h-10 border-2 
                                rounded-full shadow-md transition duration-200 px-3
                                ${isDarkMode
                                        ? 'border-white text-gray-300 bg-[#161618] hover:border-blue-400 hover:text-blue-400'
                                        : 'border-black text-black bg-white hover:bg-gradient-to-r from-black to-gray-800 hover:text-white'
                                    }`}>
                                    {user_id_param && user_id_param == user?.user.id 
                                    ? (
                                        <p>Bạn bè</p>
                                    ) 
                                    : (
                                        <p>Xem bạn chung</p>
                                    )}
                                    <FaArrowRight />
                                </button>
                            </Link>
                        </div> */}
                    </div>

                    <div className="flex flex-row gap-3 justify-evenly flex-wrap max-w-[300px]">
                        {[
                            { icon: <FaFacebook />, link: userAccount?.facebook, color: "border-blue-600 text-blue-500 hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white" },
                            { icon: <FaInstagramSquare />, link: userAccount?.instagram, color: "border-pink-600 text-pink-500 hover:bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:text-white" },
                            { icon: <FaLinkedin />, link: userAccount?.linkedin, color: "border-blue-600 text-blue-500 hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white" },
                            { icon: <FaTiktok />, link: userAccount?.tiktok, color: `hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                                ${isDarkMode ? 'bg-[#161618] text-gray-300 border-gray-500 hover:border-gray-300'
                                            : 'bg-white text-gray-700 border-gray-700'}` },
                            { icon: <FaXTwitter />, link: userAccount?.twitter, color: "border-blue-600 text-blue-500 hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white" },
                            { icon: <IoLogoYoutube />, link: userAccount?.youtube, color: "border-red-500 text-red-500 hover:bg-gradient-to-r from-red-500 to-red-600 hover:text-white" },
                            { icon: <FaDiscord />, link: userAccount?.discord, color: "border-blue-700 text-blue-500 hover:bg-gradient-to-r from-blue-600 to-blue-700 hover:text-white" },
                            { icon: <FaGithub />, link: userAccount?.github, color: `hover:bg-gradient-to-r from-gray-700 to-gray-800 hover:text-white
                                ${isDarkMode ? 'bg-[#161618] text-gray-300 border-gray-500 hover:border-gray-300'
                                            : 'bg-white text-gray-700 border-gray-700'}` },
                        ].map(({ icon, link, color }, index) => (
                            <div key={index} className="w-[60px] flex items-center justify-center">
                                {link ? (
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="w-fit">
                                        <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                            border-2 rounded-full shadow-md transition duration-200 ${color}
                                            ${isDarkMode ? 'bg-[#161618]' : 'bg-white'}
                                            cursor-pointer`}>
                                            {icon}
                                        </button>
                                    </a>
                                ) : (
                                    <button className={`flex items-center gap-2 py-2 px-4 h-fit w-fit text-xl
                                        border-2 rounded-full shadow-md transition duration-200 ${color}
                                        ${isDarkMode ? 'bg-[#161618]' : 'bg-white'}
                                        cursor-default`}>
                                        {icon}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;


