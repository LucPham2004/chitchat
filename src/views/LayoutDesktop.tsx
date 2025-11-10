import { useEffect, useRef, useState } from "react";
import Conversations from "../components/chatview/conversations/Conversations";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useDeviceTypeByWidth from "../utilities/useDeviceTypeByWidth";
import { useTheme } from "../utilities/ThemeContext";
import { useAuth } from "../utilities/AuthContext";
import { useChatContext } from "../utilities/ChatContext";
import DisplayMedia from "../components/common/DisplayMedia";
import { GlobalNotifications } from "../components/common/GlobalNotifications";
import { IncomingCallModal } from "../components/call/IncomingCallModal";
import { ROUTES } from "../utilities/Constants";
import CallView from "./CallView";

export interface ChangeWidthProps {
    toggleChangeWidth: () => void;
	isChangeWidth: boolean;
}

const LayoutDesktop = () => {
	const { user } = useAuth();
  	const { callState } = useChatContext();
  	const navigate = useNavigate();
	const deviceType = useDeviceTypeByWidth();
	const { isDarkMode } = useTheme();
	const [isChangeWidth, setChangeWidth] = useState(false);
	
	const {isDisplayMedia, setIsDisplayMedia} = useChatContext();
	const {displayMediaUrl} = useChatContext();
  
	useEffect(() => {
		if (!user) {
			navigate(ROUTES.AUTH.LOGIN);
		}

		if(deviceType == 'Mobile') {
			navigate(ROUTES.MOBILE.ROOT);
		}
		
		if (location.pathname === '/d' && user?.user.id) {
			navigate(ROUTES.DESKTOP.PROFILE(user.user.id), { replace: true });
		}
	}, [user, location.pathname, navigate]);

	return (
		<div className={`${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'} flex justify-center items-center relative`}>
			<div className={`min-h-screen w-full flex flex-row items-center justify-start px-4 py-2 max-w-[2560px]
					${deviceType == 'Mobile' ? '' : 'gap-4'}
					${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#EDEEF3]'}`}
					style={{
                    backgroundImage: `url(${isDarkMode ? '/images/sky-dark.jpg' : '/images/clouds.jpg'})`,
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
			{/* <GlobalNotifications /> */}
        	<IncomingCallModal />
			{(callState === 'OUTGOING' || callState === 'CONNECTED') && <CallView />}
		</div>
	);
}

export default LayoutDesktop;


