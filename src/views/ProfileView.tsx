import { useState } from "react";
import Conversations from "../components/homeview/conversations/Conversations";
import Profile from "../components/profile/Profile";
import { Outlet } from "react-router-dom";
import useDeviceTypeByWidth from "../utilities/useDeviceTypeByWidth";
import { useTheme } from "../utilities/ThemeContext";



const ProfileView = () => {
	const deviceType = useDeviceTypeByWidth();
	const { isDarkMode } = useTheme();

	return (
		<div className={`${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'} flex justify-center items-center`}>
			<div className={`min-h-screen w-full flex flex-row items-center justify-start px-4 py-2 max-w-[2560px]
					${deviceType == 'Mobile' ? '' : 'gap-4'}
					${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`}>
				<div className={`${  
						deviceType == 'Mobile' ? 'w-[0%]' :
						deviceType == 'Tablet' ? 'w-[40%]' : 'w-[25%]'
					}`}>
					<Conversations />
				</div>
				<div className={`${  
						deviceType == 'Mobile' ? 'w-[100%]' :
						deviceType == 'Tablet' ? 'w-[60%]' : 'w-[74%]'
					}`}>
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default ProfileView;


