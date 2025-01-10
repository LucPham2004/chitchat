import { useState } from 'react';

const RegisterView = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = (e: any) => {
		e.preventDefault();
	};

	return (
		<div className="min-h-screen flex gap-8 items-center justify-center bg-white">
			<div className="bg-[url('/ChatSample.png')] w-[35%] h-[70vh] bg-cover bg-center shadow-xl"></div>

			<div className="p-8 rounded-lg w-full max-w-md">
				<p className="text-5xl font-bold text-start text-gray-800 mb-16
					bg-gradient-to-br from-pink-500 to-blue-400 bg-clip-text text-transparent">
					Nơi tuyệt vời để kết nối năm châu bốn bể
				</p>
				<p className="text-md text-start text-gray-800 mb-6">
					Kết nối với bạn bè và gia đình, xây dựng cộng đồng và đào sâu sở thích của bạn.
				</p>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<input
							type="username"
							placeholder='Username'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<input
							type="email"
							placeholder='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<input
							type="password"
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<input
							type="password"
							placeholder='Nhập lại password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<button
							type="submit"
							className="w-fit bg-blue-500 hover:bg-blue-700 text-white text-lg 
								font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Đăng ký
						</button>
					</div>
				</form>
				<p className="mt-4 text-center text-gray-600">
					Đã có tài khoản rồi?{' '}
					<a href="/login" className="text-blue-500 hover:underline">
						Đăng nhập ngay!
					</a>
				</p>
			</div>
		</div>
	);
};

export default RegisterView;
