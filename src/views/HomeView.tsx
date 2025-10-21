import ChatAndInfo from "../components/homeview/chat-info/ChatAndInfo";
import { useEffect, useState } from "react";
import { useAuth } from "../utilities/AuthContext";
import { useNavigate } from "react-router-dom";


export interface ChangeWidthProps {
    toggleChangeWidth: () => void;
	isChangeWidth: boolean;
}

const HomeView = () => {
	const { user } = useAuth();
  	const navigate = useNavigate();
	const [isChangeWidth, setChangeWidth] = useState(false);
  
	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

    const toggleChangeWidth = () => setChangeWidth(!isChangeWidth);

	return (
		<ChatAndInfo toggleChangeWidth={toggleChangeWidth} isChangeWidth={isChangeWidth}/>
	);
};

export default HomeView;
