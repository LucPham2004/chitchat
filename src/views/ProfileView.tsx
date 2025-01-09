import { useState } from "react";
import Conversations from "../components/homeview/conversations/Conversations";
import Profile from "../components/profile/Profile";
import { Outlet } from "react-router-dom";
import useDeviceTypeByWidth from "../utilities/useDeviceTypeByWidth";



const ProfileView = () => {
	const deviceType = useDeviceTypeByWidth();

	return (
		<div className="min-h-screen w-full flex flex-row gap-4 items-center justify-start bg-gray-100 px-4 py-2">
			<div className={`${  
					deviceType == 'Mobile' ? 'w-[100%]' :
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
	);
}

export default ProfileView;


