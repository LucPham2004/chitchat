import { FaMoon, FaUserFriends } from "react-icons/fa";
import { useTheme } from "../../../utilities/ThemeContext";
import { IoMdSunny } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../utilities/AuthContext";
import { callLogout } from "../../../services/AuthService";
import Avatar from "../../common/Avatar";
import { useEffect, useState } from "react";
import { UserResponse } from "../../../types/User";
import { IoSettings } from "react-icons/io5";


const Sidebar = () => {
    const {user, setUser} = useAuth();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const LOCAL_STORAGE_KEY = 'user_account';
    const [userAccount, setUserAccount] = useState<UserResponse | null>(null);

    const handleLogout = async () => {
        try {
            await callLogout();
            localStorage.removeItem("user_account");
            localStorage.removeItem("user");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Lỗi khi logout:", error);
        }
    };
    
    useEffect(() => {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedUser && storedUser !== "undefined") {
            setUserAccount(JSON.parse(storedUser));
        }
    }, []);
    
    return (
        <div className={`min-h-[96vh] max-h-[96vh] overflow-hidden min-w-[10%] flex flex-col gap-4 
            py-2 items-center justify-between rounded-xl
            ${isDarkMode ? 'bg-[#1A1A1A] text-gray-300' : 'bg-gray-100 text-black'}`}>
            
            <div className="flex flex-col items-center gap-2">
                <Link to={`/profile/${user?.user.id}`}>
                    <button className={`rounded-full ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        <Avatar avatarUrl={userAccount ? userAccount.avatarUrl : user?.user.avatarUrl || '/user_default.avif'} width={10} height={10}></Avatar>
                    </button>
                </Link>
{/*                 
                <button className={`p-3 rounded-lg text-xl 
                    ${isDarkMode ? 'text-white hover:bg-[#5A5A5A]' 
                        : 'text-black bg-gray-100 hover:bg-gray-200'}`}>
                    <BsChatDots />
                </button> */}
                
                <Link to={`/profile/${user?.user.id}/friends`}>
                    <button className={`p-3 rounded-lg text-xl 
                        ${isDarkMode ? 'text-white hover:bg-[#5A5A5A]' 
                            : 'text-black bg-gray-100 hover:bg-gray-200'}`}>
                        <FaUserFriends />
                    </button>
                </Link>
            </div>

            <p className="font-satisfy text-xl">Chit Chat</p>
            
            <div className="flex flex-col items-center gap-2">
                <button className={` rounded-lg 
                    ${isDarkMode ? 'text-yellow-400 text-xl p-3 hover:bg-[#5A5A5A]' 
                        : 'text-yellow-400 text-2xl p-2.5 bg-gray-100 hover:bg-gray-200'}`}
                        onClick={toggleDarkMode}>
                    {isDarkMode ? <IoMdSunny /> : <FaMoon />}
                </button>

                <button className={`p-3 rounded-lg text-xl
                    ${isDarkMode ? 'text-white hover:bg-[#545454]' 
                        : 'text-black bg-gray-100 hover:bg-gray-200'}`}>
                    <IoSettings />
                </button>

                <button className={`p-3 rounded-lg text-xl
                    ${isDarkMode ? 'text-white hover:bg-[#545454]' 
                        : 'text-black bg-gray-100 hover:bg-gray-200'}`}
                        onClick={handleLogout} >
                    <FiLogOut />
                </button>
            </div>

        </div>
    );
};

export default Sidebar;

