import { useEffect, useRef, useState } from "react";
import Conversations from "../components/homeview/conversations/Conversations";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useDeviceTypeByWidth from "../utilities/useDeviceTypeByWidth";
import { useTheme } from "../utilities/ThemeContext";
import { useAuth } from "../utilities/AuthContext";
import { useChatContext } from "../utilities/ChatContext";
import DisplayMedia from "../components/common/DisplayMedia";
import { GlobalNotifications } from "../components/common/GlobalNotifications";
import { IncomingCallModal } from "../components/call/IncomingCallModal";

export interface ChangeWidthProps {
    toggleChangeWidth: () => void;
	isChangeWidth: boolean;
}

const LayoutDesktop = () => {
	const { user } = useAuth();
  	const { showIncomingCallModal } = useChatContext();
  	const navigate = useNavigate();
	const deviceType = useDeviceTypeByWidth();
	const { isDarkMode } = useTheme();
	const [isChangeWidth, setChangeWidth] = useState(false);
	
	const {isDisplayMedia, setIsDisplayMedia} = useChatContext();
	const {displayMediaUrl} = useChatContext();
  
	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
		
		if (location.pathname === '/' && user?.user.id) {
			navigate(`/profile/${user.user.id}`, { replace: true });
		}
	}, [user, location.pathname, navigate]);

	return (
		<div className={`${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'} flex justify-center items-center relative`}>
			<div className={`min-h-screen w-full flex flex-row items-center justify-start px-4 py-2 max-w-[2560px]
					${deviceType == 'Mobile' ? '' : 'gap-4'}
					${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#EDEEF3]'}`}
					style={{
                    backgroundImage: `url(${isDarkMode ? '/sky-dark.jpg' : ''})`,
					backgroundSize: 'cover'
                }}>
				<div className={`
                    ${  
						deviceType == 'Tablet' ? 'w-[40%]' :
						isChangeWidth ? 'w-[33%]' : 'w-[27%]'
					}`}>
					<Conversations />
				</div>
				<div className={`
                    ${
						deviceType == 'Tablet' ? 'w-[60%]' :
						isChangeWidth ? 'w-[66%]' : 'w-[72%]'
					}`}>
					<Outlet />
				</div>
			</div>
            {isDisplayMedia && (
                <DisplayMedia url={displayMediaUrl} setIsDisplayMedia={setIsDisplayMedia} />
            )}
			<GlobalNotifications />
			{showIncomingCallModal && (
            	<IncomingCallModal />
			)}
		</div>
	);
}

export default LayoutDesktop;


