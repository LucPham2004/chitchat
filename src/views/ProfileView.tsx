import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../utilities/AuthContext";

const ProfileView = () => {
	const { user } = useAuth();
  	const navigate = useNavigate();
  
	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	}, [user, navigate]);

	return (
		<Outlet />
	);
}

export default ProfileView;


