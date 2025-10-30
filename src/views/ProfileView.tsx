import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../utilities/AuthContext";
import { ROUTES } from "../utilities/Constants";

const ProfileView = () => {
	const { user } = useAuth();
  	const navigate = useNavigate();
  
	useEffect(() => {
		if (!user) {
			navigate(ROUTES.AUTH.LOGIN);
		}
	}, [user, navigate]);

	return (
		<Outlet />
	);
}

export default ProfileView;


