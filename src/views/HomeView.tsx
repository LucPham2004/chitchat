import { Outlet } from "react-router-dom";


const HomeView = () => {

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
			<Outlet />
		</div>
	);
};

export default HomeView;
