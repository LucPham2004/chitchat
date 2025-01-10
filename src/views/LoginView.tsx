import { useState } from 'react';

const LoginView = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: any) => {
		e.preventDefault();
	};

	return (
		<div className="min-h-screen flex gap-8 items-center justify-center bg-white">
			<div className="bg-[url('/ChatSample.png')] w-[35%] h-[70vh] bg-cover bg-center shadow-xl">

			</div>
			<div className="p-8 rounded-lg w-full max-w-[544px]">
				<p className="text-5xl font-bold text-start text-gray-800 mb-16
					bg-gradient-to-br from-blue-500 to-pink-400 bg-clip-text text-transparent">
					Nơi tuyệt vời để kết nối năm châu bốn bể
				</p>
				<p className="text-md text-start text-gray-800 mb-6">
					Kết nối với bạn bè và gia đình, xây dựng cộng đồng và đào sâu sở thích của bạn.
				</p>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<input
							type="email"
							placeholder='Username hoặc email hoặc sđt'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-2 mt-2 border rounded-xl bg-gray-100 
								focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<input
							type="password"
							placeholder='Mật khẩu'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-4 py-2 mt-2 border rounded-xl bg-gray-100 
								focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<button
							type="submit"
							className="w-fit bg-blue-500 hover:bg-blue-700 text-white text-lg 
								font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Login
						</button>
					</div>
				</form>
				<p className="mt-4 text-center text-gray-600">
					Chưa có tài khoản?{' '}
					<a href="#" className="text-blue-500 hover:underline">
						Đăng ký ngay!
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginView;
