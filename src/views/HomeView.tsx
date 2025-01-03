import { Outlet } from "react-router-dom";
import Conversations from "../components/homeview/conversations/Conversations";
import ChatAndInfo from "../components/homeview/chat-info/ChatAndInfo";
import { useState } from "react";


export interface ChangeWidthProps {
    toggleChangeWidth: () => void;
	isChangeWidth: boolean;
}

const HomeView = () => {
	const [isChangeWidth, setChangeWidth] = useState(false);

    const toggleChangeWidth = () => setChangeWidth(!isChangeWidth);

	return (
		<div className="min-h-screen w-full flex flex-row gap-4 items-center justify-start bg-gray-100 px-4 py-2">
			<div className={`transition-all duration-100 ${isChangeWidth ? 'w-[33%]' : 'w-[25%]'}`}>
				<Conversations />
			</div>
			<div className={`transition-all duration-100 ${isChangeWidth ? 'w-[66%]' : 'w-[74%]'}`}>
				<ChatAndInfo toggleChangeWidth={toggleChangeWidth} isChangeWidth={isChangeWidth} />
			</div>
		</div>
	);
};

export default HomeView;
