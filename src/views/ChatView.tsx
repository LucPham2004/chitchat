import ChatAndInfo from "../components/chatview/chat-info/ChatAndInfo";
import { useEffect, useState } from "react";
import { useAuth } from "../utilities/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utilities/Constants";


export interface ChangeWidthProps {
    toggleChangeWidth: () => void;
	isChangeWidth: boolean;
}

const ChatView = () => {
	const { user } = useAuth();
  	const navigate = useNavigate();
	const [isChangeWidth, setChangeWidth] = useState(false);
  
	useEffect(() => {
		if (!user) {
			navigate(ROUTES.AUTH.LOGIN);
		}
	}, [user, navigate]);

    const toggleChangeWidth = () => setChangeWidth(!isChangeWidth);

	return (
		<ChatAndInfo toggleChangeWidth={toggleChangeWidth} isChangeWidth={isChangeWidth}/>
	);
};

export default ChatView;
