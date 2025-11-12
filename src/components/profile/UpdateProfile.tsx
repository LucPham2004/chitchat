import { useEffect, useRef, useState } from "react";
import { IoCamera, IoClose, IoLogoYoutube } from "react-icons/io5";
import { UserResponse, UserUpdateImageRequest, UserUpdateLinksRequest, UserUpdateRequest } from "../../types/User";
import { uploadUserImage } from "../../services/ImageService";
import { getOtherUserById, updateUser, updateUserImages, updateUserLinks } from "../../services/UserService";
import { useAuth } from "../../utilities/AuthContext";
import { useTheme } from "../../utilities/ThemeContext";
import { FaArrowLeft, FaDiscord, FaFacebook, FaGithub, FaInstagramSquare, FaLinkedin, FaTiktok } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import useDeviceTypeByWidth from "../../utilities/DeviceType";
import toast, { Toaster } from "react-hot-toast";
import { ROUTES } from "../../utilities/Constants";


const UpdateProfile: React.FC = ({ }) => {
    const { user } = useAuth();
    const { user_id_param } = useParams();
    const { isDarkMode } = useTheme();
    const deviceType = useDeviceTypeByWidth();

    const [userAccount, setUserAccount] = useState<UserResponse | null>(null);
    const [userProfile, setUserProfile] = useState<UserResponse | null>(null);

    // User info to update
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [bio, setBio] = useState("");
    const [job, setJob] = useState("");
    const [location, setLocation] = useState("");

    // Social links to update
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [tiktok, setTiktok] = useState("");
    const [youtube, setYoutube] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");
    const [discord, setDiscord] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user?.user.avatarUrl ? user?.user.avatarUrl : userAccount ? userAccount.avatarUrl : null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                if (response.result) {
                    await handleUpdateImages(true);
                    await handleUpdateLinks();
                    setUserProfile(response.result);
                    setUserAccount(response.result);
                } else {
                    alert("Cập nhật thất bại!");
                }
            }
        } catch (error: any) {
            if (error.response) {
                console.error("Lỗi từ server:", error.response.data);
                alert(`Lỗi từ server: ${error.response.data.message || "Cập nhật thất bại!"}`);
            } else if (error.request) {
                console.error("Lỗi mạng:", error.message);
                alert("Không thể kết nối đến server, vui lòng kiểm tra mạng!");
            } else {
                console.error("Lỗi không xác định:", error.message);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } finally {
            toast.success("Cập nhật thông tin thành công!");
            
            setTimeout(() => {
                if(deviceType == 'Mobile') {
                    window.location.href = ROUTES.MOBILE.PROFILE(user?.user.id);
                } else {
                    window.location.href = ROUTES.DESKTOP.PROFILE(user?.user.id);
                }
            }, 1500)
        }
    };


    const handleUpdateImages = async (isUpdateAvatar: boolean) => {
        try {
            if (!selectedFile || !userAccount) return;

            const uploadResult = await uploadUserImage(selectedFile, user?.user.id ? user.user.id : userAccount.id);

            if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url) {
                console.error("Lỗi khi tải ảnh lên:", uploadResult);
                return;
            }

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
            console.log("Cập nhật thành công:", response);

        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        }
    };

    const handleUpdateLinks = async () => {
        try {
            if (!user?.user.id) return;

            // Kiểm tra xem có ít nhất một link không rỗng
            if (![facebook, instagram, twitter, tiktok, youtube, linkedin, discord, github].some((link) => link)) {
                console.log("Không có link nào để cập nhật.");
                return;
            }

            const request: UserUpdateLinksRequest = {
                id: user?.user.id,
                facebook,
                instagram,
                twitter,
                tiktok,
                youtube,
                linkedin,
                discord,
                github
            };
            console.log("Request:", request);
            const response = await updateUserLinks(request);

            if (response.result) {
                setUserProfile(response.result);
                setUserAccount(response.result);
            } else {
                alert("Cập nhật thất bại!");
            }
            
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    const isMountedRef = useRef(true);

    const fetchUser = async () => {
        try {
            if (user?.user.id && user_id_param) {
                const response = await getOtherUserById(user?.user.id, user_id_param);
                console.log(response);
                if (response.result) {
                    localStorage.setItem('user_account', JSON.stringify(response.result));
                    setUserAccount(response.result);
                    localStorage.setItem("user_profile", JSON.stringify(response.result));
                    setUserProfile(response.result);
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
        }
    };

    // Tải dữ liệu khi component được mount và khi user_id_param thay đổi
    useEffect(() => {
        isMountedRef.current = true; // Đánh dấu là component đang mounted

        const fetchData = async () => {
            const storedUser = localStorage.getItem('user_account');
            const storedProfile = localStorage.getItem("user_profile");
            if (storedUser && storedUser !== "undefined" && user_id_param && user_id_param == user?.user.id) {
                setUserAccount(JSON.parse(storedUser));
            }
            if (storedProfile && storedProfile !== "undefined" && user_id_param && user_id_param != user?.user.id) {
                setUserProfile(JSON.parse(storedProfile));
            } else {
                await fetchUser();
            }
        };

        fetchData();

        return () => {
            isMountedRef.current = false; // Cleanup khi component unmount
        };
    }, []);

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className={`overflow-hidden w-full flex
                pb-0 rounded-xl border shadow-sm overflow-y-auto
                ${deviceType == 'Mobile' ? 'max-h-[100dvh]' : 'min-h-[96dvh] max-h-[96dvh]'}
                ${isDarkMode ? 'bg-[#161618] border-gray-900 text-gray-300' : 'bg-white border-gray-200 text-black'}`}>
            <div className={`relative flex flex-col items-center w-full pt-0
                ${deviceType == 'Mobile' ? 'max-h-[100dvh]' : 'min-h-[96dvh] max-h-[96dvh]'}`}>
                
                {/* 🔔 Toast */}
                <Toaster position="top-center" toastOptions={{
                    style: {
                    background: "#fff",
                    color: "#333",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    },
                }} />

                <div className={`sticky top-0 z-50 min-w-full w-full pt-4 pb-6 flex border-b mb-4
                    ${deviceType == 'Mobile' ? 'justify-between px-2' : 'items-center justify-center'}
                    ${isDarkMode ? "bg-[#161618] border-gray-600" : "bg-white border-gray-300"}`}>
                    <div className={`top-4 left-4 z-10 ${deviceType == 'Mobile' ? '' : 'absolute'}`}>
                        <button className={`p-2 rounded-full text-xl
                        ${isDarkMode ? 'text-gray-200 bg-[#474747] hover:bg-[#5A5A5A]'
                                : 'text-black bg-gray-200 hover:bg-gray-100'}`}
                            onClick={goBack}>
                            <FaArrowLeft />
                        </button>
                    </div>
                    <h2 className={`self-center md:text-xl sx:text-md font-semibold text-center
                        ${deviceType == 'Mobile' ? '' : ''}`}>
                        {deviceType == 'Mobile' ? 'Cập nhật thông tin' : 'Cập nhật thông tin cá nhân'}
                    </h2>
                    {/* Nút cập nhật */}
                    <div className={`top-4 right-4 z-10 flex justify-center ${deviceType == 'Mobile' ? '' : 'absolute'}`}>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                            onClick={handleUpdateProfile}
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>

                <div className={`relative p-6 rounded-xl w-full max-w-[800px] 
                    ${isDarkMode ? "bg-[#161618] text-gray-300" : "bg-white text-black"}`}>

                    {/* Ảnh đại diện */}
                    <div className="w-full flex items-center justify-center md:justify-between border-b border-gray-300 px-20 pb-4 mb-4">
                        {previewUrl ? (
                            <div className="relative w-32 h-32 rounded-full mb-4 cursor-pointer" onClick={handleCameraClick}>
                                <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
                                <div className={`absolute top-4 right-4 opacity-0 text-4xl text-gray-800  
                                        rounded-full p-8 bg-gray-300
                                        ${deviceType == 'Mobile' ? 'opacity-60' : 'hover:opacity-60'}`}>
                                    <IoCamera />
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`w-32 h-32 text-4xl rounded-full mb-4 flex items-center justify-center cursor-pointer 
                                        ${isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"}`}
                                onClick={handleCameraClick}
                            >
                                <span className="rounded-full p-8 bg-gray-300">
                                    <IoCamera />
                                </span>
                            </div>
                        )}
                        {deviceType !== 'Mobile' && (
                        <button
                            onClick={handleCameraClick}
                            className={`flex items-center justify-center gap-2 py-2 px-4 h-fit rounded-full
                                ${isDarkMode ? 'border-white text-white' : 'border-black text-black'}
                                border-2 hover:text-blue-500 shadow-md transition duration-200`}>
                            <BiSolidEditAlt />
                            <p className="font-semibold">Đổi ảnh đại diện</p>
                        </button>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 w-full border-b border-gray-300 pb-4 mb-4">

                        {/* Form cập nhật thông tin */}
                        <div className="space-y-3 w-full">
                            <div className="flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0">
                                <div className="w-full">
                                    <label className="block text-sm font-medium mb-2">Họ đệm</label>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.firstName}
                                        className={`w-full p-2 border rounded-md 
                                            ${isDarkMode ? "bg-[#161618] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-medium mb-2">Tên</label>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.lastName}
                                        className={`w-full p-2 border rounded-md 
                                            ${isDarkMode ? "bg-[#161618] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="w-full">
                                    <label className="block text-sm font-medium mb-2">Ngày sinh</label>
                                    <input
                                        type="date"
                                        className={`w-full p-2 border rounded-md 
                                            ${isDarkMode ? "bg-[#161618] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-medium mb-2">Giới tính</label>
                                    <select
                                        className={`w-full p-2 border rounded-md 
                                            ${isDarkMode ? "bg-[#161618] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                        <option value="Other">Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Tiểu sử</label>
                                <textarea
                                    rows={3}
                                    placeholder={userAccount?.bio ? userAccount?.bio : "Tiểu sử (bio)"}
                                    className={`w-full p-2 border rounded-md 
                                        ${isDarkMode ? "bg-[#161618] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Nghề nghiệp</label>
                                <input
                                    type="text"
                                    placeholder={userAccount?.job ? userAccount?.job : "Nghề nghiệp"}
                                    className={`w-full p-2 border rounded-md 
                                        ${isDarkMode ? "bg-[#161618] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                    value={job}
                                    onChange={(e) => setJob(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Nơi sinh sống</label>
                                <input
                                    type="text"
                                    placeholder={userAccount?.location ? userAccount?.location : "Nơi sinh sống"}
                                    className={`w-full p-2 border rounded-md 
                                        ${isDarkMode ? "bg-[#161618] text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                        <h2 className="self-center text-lg font-semibold text-center">Cập nhật liên kết mạng xã hội</h2>
                        {/* Form cập nhật link social media */}
                        <div className="space-y-3 w-full">
                            {/* <h2 className="text-lg font-semibold mb-6 text-center">Liên kết mạng xã hội</h2> */}
                            <div className="flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0">
                                <div className={`w-full border rounded-full relative
                                    ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                                    <button className={`absolute flex items-center gap-2 p-2 h-fit w-fit text-xl
                                            border-[2.8px] border-blue-600 text-blue-600 
                                            hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                                            rounded-full transition duration-200
                                            ${isDarkMode ? 'bg-[#161618]' : 'bg-white'}`}>
                                        <FaFacebook />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.facebook ? userAccount?.facebook : "Facebook"}
                                        className={`w-full p-2 ps-12 border rounded-full
                                                ${isDarkMode ? "bg-[#161618] text-white border-gray-600" 
                                                    : "bg-white text-black border-gray-300"}`}
                                        value={facebook}
                                        onChange={(e) => setFacebook(e.target.value)}
                                    />
                                </div>
                                <div className={`w-full border rounded-full relative
                                    ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                                    <button className={`absolute flex items-center gap-2 p-2 h-fit w-fit text-xl
                                            border-[2.8px] border-blue-600 text-blue-600 
                                            hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                                            rounded-full transition duration-200
                                            ${isDarkMode ? 'bg-[#161618]' : 'bg-white'}`}>
                                        <FaXTwitter />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.twitter ? userAccount?.twitter : "Twitter"}
                                        className={`w-full p-2 ps-12 border rounded-full
                                                ${isDarkMode ? "bg-[#161618] text-white border-gray-600" 
                                                    : "bg-white text-black border-gray-300"}`}
                                        value={twitter}
                                        onChange={(e) => setTwitter(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0">
                                <div className={`w-full border rounded-full relative
                                    ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                                    <button className={`absolute flex items-center gap-2 p-2 h-fit w-fit text-xl
                                            border-[2.8px] border-pink-600 text-pink-500 
                                            hover:bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:text-white 
                                            rounded-full transition duration-200
                                            ${isDarkMode ? 'bg-[#161618]' : 'bg-white'}`}>
                                        <FaInstagramSquare />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.instagram ? userAccount?.instagram : "Instagram"}
                                        className={`w-full p-2 ps-12 border rounded-full
                                                ${isDarkMode ? "bg-[#161618] text-white border-gray-600" 
                                                    : "bg-white text-black border-gray-300"}`}
                                        value={instagram}
                                        onChange={(e) => setInstagram(e.target.value)}
                                    />
                                </div>
                                <div className={`w-full border rounded-full relative
                                    ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                                    <button className={`absolute flex items-center gap-2 p-2 h-fit w-fit text-xl
                                            border-[2.8px] border-red-500 text-red-500 
                                            hover:bg-gradient-to-r from-red-500 to-red-600 hover:text-white 
                                            rounded-full transition duration-200
                                            ${isDarkMode ? 'bg-[#161618]' : 'bg-white'}`}>
                                        <IoLogoYoutube />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.youtube ? userAccount?.youtube : "Youtube"}
                                        className={`w-full p-2 ps-12 border rounded-full
                                                ${isDarkMode ? "bg-[#161618] text-white border-gray-600" 
                                                    : "bg-white text-black border-gray-300"}`}
                                        value={youtube}
                                        onChange={(e) => setYoutube(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0">
                                <div className={`w-full border rounded-full relative
                                    ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                                    <button className={`absolute flex items-center gap-2 p-2 h-fit w-fit text-xl
                                            border-[2.8px] border-blue-600 text-blue-600 
                                            hover:bg-gradient-to-r from-blue-500 to-blue-600 hover:text-white 
                                            rounded-full transition duration-200
                                            ${isDarkMode ? 'bg-[#161618]' : 'bg-white'}`}>
                                        <FaLinkedin />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.linkedin ? userAccount?.linkedin : "Linkedin"}
                                        className={`w-full p-2 ps-12 border rounded-full
                                                ${isDarkMode ? "bg-[#161618] text-white border-gray-600" 
                                                    : "bg-white text-black border-gray-300"}`}
                                        value={linkedin}
                                        onChange={(e) => setLinkedin(e.target.value)}
                                    />
                                </div>
                                <div className={`w-full border rounded-full relative
                                    ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                                    <button className={`absolute flex items-center gap-2 p-2 h-fit w-fit text-xl
                                            border-[2.8px] border-blue-700 text-blue-700 
                                            hover:bg-gradient-to-r from-blue-700 to-blue-800 hover:text-white 
                                            rounded-full transition duration-200
                                            ${isDarkMode ? 'bg-[#161618]' : 'bg-white'}`}>
                                        <FaDiscord />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.discord ? userAccount?.discord : "Discord"}
                                        className={`w-full p-2 ps-12 border rounded-full
                                                ${isDarkMode ? "bg-[#161618] text-white border-gray-600" 
                                                    : "bg-white text-black border-gray-300"}`}
                                        value={discord}
                                        onChange={(e) => setDiscord(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0">
                                <div className={`w-full border rounded-full relative
                                    ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                                    <button className={`absolute flex items-center gap-2 p-2 h-fit w-fit text-xl
                                            border-[2.8px] hover:bg-gradient-to-r from-black to-gray-800 hover:text-white 
                                            rounded-full shadow-md transition duration-200
                                            ${isDarkMode ? 'bg-[#161618] text-gray-400 border-gray-600 hover:border-gray-300'
                                            : 'bg-white text-gray-700 border-gray-700'}`}>
                                        <FaTiktok />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.tiktok ? userAccount?.tiktok : "Tiktok"}
                                        className={`w-full p-2 ps-12 border rounded-full
                                                ${isDarkMode ? "bg-[#161618] text-white border-gray-600" 
                                                    : "bg-white text-black border-gray-300"}`}
                                        value={tiktok}
                                        onChange={(e) => setTiktok(e.target.value)}
                                    />
                                </div>
                                <div className={`w-full border rounded-full relative
                                    ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                                    <button className={`absolute flex items-center gap-2 p-2 h-fit w-fit text-xl
                                            border-[2.8px] hover:bg-gradient-to-r from-gray-700 to-gray-800 hover:text-white 
                                            rounded-full shadow-md transition duration-200
                                            ${isDarkMode ? 'bg-[#161618] text-gray-400 border-gray-600 hover:border-gray-300'
                                            : 'bg-white text-gray-700 border-gray-700'}`}>
                                        <FaGithub />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={userAccount?.github ? userAccount?.github : "Github"}
                                        className={`w-full p-2 ps-12 border rounded-full
                                                ${isDarkMode ? "bg-[#161618] text-white border-gray-600" 
                                                    : "bg-white text-black border-gray-300"}`}
                                        value={github}
                                        onChange={(e) => setGithub(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;

