import { Outlet } from "react-router-dom";
import Conversations from "../components/homeview/conversations/Conversations";
import ChatAndInfo from "../components/homeview/chat-info/ChatAndInfo";


const HomeView = () => {

	return (
		<div className="min-h-screen w-full flex flex-row gap-4 items-center justify-start bg-gray-100 px-4 py-2">
			<Conversations />
			<ChatAndInfo />
		</div>
	);
};

export default HomeView;
