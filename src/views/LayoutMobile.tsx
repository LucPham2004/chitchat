import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../utilities/ThemeContext";
import { useAuth } from "../utilities/AuthContext";
import { useChatContext } from "../utilities/ChatContext";
import DisplayMedia from "../components/common/DisplayMedia";
import { GlobalNotifications } from "../components/common/GlobalNotifications";
import { IncomingCallModal } from "../components/call/IncomingCallModal";
import useDeviceTypeByWidth from "../utilities/useDeviceTypeByWidth";

export interface ChangeWidthProps {
    toggleChangeWidth: () => void;
    isChangeWidth: boolean;
}

const LayoutMobile = () => {
    const { user } = useAuth();
    const { showIncomingCallModal } = useChatContext();
	const deviceType = useDeviceTypeByWidth();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    
    const {isDisplayMedia, setIsDisplayMedia} = useChatContext();
    const {displayMediaUrl} = useChatContext();
  
    useEffect(() => {
        if (!user) {
            navigate("/");
        }

		if(deviceType != 'Mobile') {
			navigate("/");
		}
        
        if (location.pathname === '/' && user?.user.id) {
            navigate(`/mobile/profile/${user.user.id}`, { replace: true });
        }
    }, [user, location.pathname, navigate]);

    return (
        <div className={`${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'} relative`}>
            <div className={`min-h-screen w-full 
                    ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#EDEEF3]'}`}
                    style={{
                    backgroundImage: `url(${isDarkMode ? '/sky-dark.jpg' : ''})`,
                    backgroundSize: 'cover'
                }}>
                <Outlet />
            </div>
            {isDisplayMedia && (
                <DisplayMedia url={displayMediaUrl} setIsDisplayMedia={setIsDisplayMedia} />
            )}
            {/* <GlobalNotifications /> */}
            {showIncomingCallModal && (
                <IncomingCallModal />
            )}
        </div>
    );
}

export default LayoutMobile;


