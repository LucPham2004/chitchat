import { useState } from 'react';
import useDeviceTypeByWidth from '../utilities/useDeviceTypeByWidth';

const RegisterView = () => {
	const deviceType = useDeviceTypeByWidth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = (e: any) => {
		e.preventDefault();
	};

	return (
		<div className='flex items-center justify-center'>
			<div className="min-h-screen w-full max-w-[2048px] relative flex gap-8 items-center justify-center bg-white">
				{deviceType == 'PC' &&
					<div className='w-3/5 flex items-center justify-center relative'>
						<div className="absolute -translate-y-1/4 translate-x-3/4 bg-[url('/ChatSample.png')] 
							w-[380px] h-[360px] bg-cover bg-center shadow-xl rounded-xl"></div>
						<div className="bg-[url('/profileImage.png')] w-[590px] h-[360px] bg-cover bg-center shadow-xl rounded-xl"></div>
					</div>
				}
				<div className={`${deviceType == 'PC' ? 'w-2/5' : 'w-full'}`}>
					<div className="p-8 rounded-lg w-full max-w-md">
						<p className="text-5xl font-bold text-start text-gray-800 mb-8
							bg-gradient-to-br from-pink-500 to-blue-400 bg-clip-text text-transparent">
							Nơi tuyệt vời để kết nối năm châu bốn bể
						</p>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className='flex items-center gap-4'>
								<input
									type="firstName"
									placeholder='firstName'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-1/2 px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<input
									type="lastName"
									placeholder='lastName'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-1/2 px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className='flex gap-2 rounded-xl'>
									<p>Nam</p>
									<input type="radio" name="gender" value="male" />
								</label>
								<br />
								<label className='flex gap-2 rounded-xl'>
									Nữ
									<input type="radio" name="gender" value="female" />
								</label>
								<br />
								<label className='flex gap-2 rounded-xl'>
									Khác
									<input type="radio" name="gender" value="other" />
								</label>
								<br />
							</div>
							<div>
								<input
									type="email"
									placeholder='Username hoặc email hoặc số điện thoại'
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
			</div>
		</div>
	);
};

export default RegisterView;
