import { useState } from "react";
import Conversations from "../components/homeview/conversations/Conversations";
import Profile from "../components/profile/Profile";



const ProfileView = () => {
    

	return (
		<div className="min-h-screen w-full flex flex-row gap-4 items-center justify-start bg-gray-100 px-4 py-2">
			<div className={`w-[25%]`}>
				<Conversations />
			</div>
			<div className={`w-[74%]`}>
				<Profile />
			</div>
		</div>
	);
}

export default ProfileView;


