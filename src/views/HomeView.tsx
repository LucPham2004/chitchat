import Conversations from "../components/homeview/conversations/Conversations";
import ChatAndInfo from "../components/homeview/chat-info/ChatAndInfo";
import { useEffect, useState } from "react";
import useDeviceTypeByWidth from "../utilities/useDeviceTypeByWidth";
import { useTheme } from "../utilities/ThemeContext";
import { useAuth } from "../utilities/AuthContext";
import { useNavigate } from "react-router-dom";


export interface ChangeWidthProps {
    toggleChangeWidth: () => void;
	isChangeWidth: boolean;
}

const HomeView = () => {
	const { user } = useAuth();
  	const navigate = useNavigate();
	const deviceType = useDeviceTypeByWidth();
	const { isDarkMode } = useTheme();
	const [isChangeWidth, setChangeWidth] = useState(false);
  
	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

    const toggleChangeWidth = () => setChangeWidth(!isChangeWidth);

	return (
		<div className={`${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'} flex justify-center items-center`}>
			<div className={`min-h-screen w-full flex flex-row items-center justify-start px-4 py-2 max-w-[2560px]
					${deviceType == 'Mobile' ? '' : 'gap-4'}
					${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`}>
				<div className={`transition-all duration-100 
					${  
						deviceType == 'Mobile' ? 'w-[100%]' :
						deviceType == 'Tablet' ? 'w-[40%]' :
						isChangeWidth ? 'w-[33%]' : 'w-[27%]'
					}`}>
					<Conversations />
				</div>
				<div className={`transition-all duration-100 
					${
						deviceType == 'Mobile' ? 'w-[0%]' :
						deviceType == 'Tablet' ? 'w-[60%]' :
						isChangeWidth ? 'w-[66%]' : 'w-[72%]'
					}`}>
					<ChatAndInfo toggleChangeWidth={toggleChangeWidth} isChangeWidth={isChangeWidth}/>
				</div>
			</div>
		</div>
	);
};

export default HomeView;
