import { Link } from "react-router-dom";


const ErrorPage = () => {
	return (
		<div className="min-h-screen bg-[url('/blurBg.png')] bg-cover bg-center flex justify-center items-center">
			<div className="absolute inset-0"></div>
			<div className="relative z-10 h-fit w-fit flex flex-col justify-center items-center bg-gray-200 p-10 rounded-3xl">
				<div className="flex items-center">
					<h1 className="text-9xl font-extrabold font-satisfy bg-gradient-to-br from-red-500 to-yellow-400 bg-clip-text text-transparent tracking-widest">4</h1>
					<h1 className="text-9xl font-extrabold font-satisfy bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent tracking-widest">0</h1>
					<h1 className="text-9xl font-extrabold font-satisfy bg-gradient-to-br from-yellow-400 to-red-500 bg-clip-text text-transparent tracking-widest">4</h1>
				</div>
				<div className="bg-gradient-to-r from-blue-500 to-purple-400 px-2 py-1 mb-10 text-lg rounded rotate-12 absolute font-satisfy">
					Page Not Found
				</div>
				<p className="mt-16 text-xl text-gray-600">Oops! Trang bạn tìm không tồn tại hoặc đã bị xóa.</p>
				<p className="text-gray-500 text-center mb-8 w-[530px]">Bạn có thể quay lại trang chủ hoặc liên hệ với chúng tôi để được hỗ trợ.
					Bạn cũng có thể đăng ký tài khoản để sử dụng dịch vụ của chúng tôi.</p>
				<div className="flex items-center justify-center gap-4">
					<Link
						to="/"
						className="px-6 py-2 border-2 border-blue-700 text-blue-700 bg-white 
          hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white rounded-full shadow-md transition duration-300"
					>
						Trang chủ
					</Link>
					<Link
						to="/login"
						className="px-6 py-2 border-2 border-blue-700 text-blue-700 bg-white 
          hover:bg-gradient-to-r from-blue-500 to-purple-400 hover:text-white rounded-full shadow-md transition duration-300"
					>
						Đăng ký tài khoản
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ErrorPage;
