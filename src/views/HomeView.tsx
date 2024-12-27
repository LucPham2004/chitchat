import { Outlet } from "react-router-dom";


const HomeView = () => {

	return (
		<div className="min-h-screen w-full flex flex-row items-center justify-start bg-gray-100 px-4 py-2">
			<Outlet />
		</div>
	);
};

export default HomeView;
