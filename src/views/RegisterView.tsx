import { useEffect, useState } from 'react';
import useDeviceTypeByWidth from '../utilities/useDeviceTypeByWidth';
import { callLogin, callRegister } from '../services/AuthService';
import { Gender } from '../types/User';
import { Account } from '../types/backend';
import { useAuth } from '../utilities/AuthContext';

const RegisterView = () => {
	const deviceType = useDeviceTypeByWidth();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [gender, setGender] = useState<Gender>(Gender.MALE);
	const [dob, setDob] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	
		if (password !== confirmPassword) {
			alert("Mật khẩu nhập lại không khớp!");
			return;
		}
	
		try {
			const response = await callRegister({
				username,
				password,
				email,
				firstName,
				lastName,
				dob,
				gender,
			});

			if(response.data.code === 1000 && response.data.result) {
				
				alert("Đăng ký thành công!");
				const response = await callLogin(username, password);
				console.log('Login response:', response.data);
				if (response.data.code === 1000 && response.data.result) {
					const account: Account = response.data.result;
					login(account);
					window.location.href = `/profile/${account.user.id}`;
				} else {
					alert('Đăng nhập thất bại: ' + response.data.message);
				}
			}
			console.log(response.data);
		} catch (error: any) {
			alert("Đăng ký thất bại: " + (error.response?.data?.message || "Lỗi không xác định"));
		}
	};
	
	useEffect(() => {
		document.title = "Đăng ký | Chit Chat";
	}, []);

	return (
		<div className='flex items-center justify-center'>
			<div className="min-h-screen w-full max-w-[2048px] relative flex gap-8 items-center justify-center bg-white">
				{deviceType == 'PC' &&
					<div className='w-3/5 flex items-center justify-center relative'>
					<div className="absolute -translate-y-1/4 translate-x-2/3 bg-[url('/ChatSample.png')] 
						w-[360px] h-[340px] bg-cover bg-center shadow-xl rounded-xl"></div>
					<div className="bg-[url('/profileImage.png')] w-[480px] h-[290px] bg-cover bg-center shadow-xl rounded-xl"></div>
				</div>
			}
			<div className={`${deviceType == 'PC' ? 'w-2/5' : 'w-full flex items-center justify-center'}`}>
					<div className="p-8 rounded-lg w-full max-w-md">
						<p className="text-5xl font-bold text-start text-gray-800 mb-6
							bg-gradient-to-br from-pink-500 to-blue-400 bg-clip-text text-transparent">
							Nơi tuyệt vời để kết nối năm châu bốn bể
						</p>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className='flex items-center gap-4'>
								<input
									type="firstName"
									placeholder='Họ đệm'
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									required
									className="w-1/2 ps-4 pe-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<input
									type="lastName"
									placeholder='Tên'
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									required
									className="w-1/2 ps-4 pe-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className='flex justify-between '>
								<label className='flex gap-10 rounded-lg border border-gray-200 py-2 ps-4 pe-6'>
									<p>Nam</p>
									<input type="radio" name="gender" value={Gender.MALE} className='w-4 h-4' 
										checked={gender === Gender.MALE}
										onChange={() => setGender(Gender.MALE)}/>
								</label>
								<br />
								<label className='flex gap-10 rounded-lg border border-gray-200 py-2 ps-4 pe-6'>
									Nữ
									<input type="radio" name="gender" value={Gender.FEMALE} className='w-4 h-4' 
										checked={gender === Gender.FEMALE}
										onChange={() => setGender(Gender.FEMALE)}/>
								</label>
								<br />
								<label className='flex gap-10 rounded-lg border border-gray-200 py-2 ps-4 pe-6'>
									Khác
									<input type="radio" name="gender" value={Gender.OTHER} className='w-4 h-4' 
										checked={gender === Gender.OTHER}
										onChange={() => setGender(Gender.OTHER)}/>
								</label>
								<br />
							</div>
							<div>
								<input
									type="date"
									placeholder='Ngày sinh'
									value={dob}
									onChange={(e) => setDob(e.target.value)}
									required
									className="w-full ps-4 pe-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								{/* <p className='text-sm text-red-600'>Username hoặc email đã tồn tại</p> */}
								<input
									type="text"
									placeholder='Username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									className="w-full ps-4 pe-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<input
									type="password"
									placeholder='Mật khẩu'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="w-full ps-4 pe-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								{/* <p className='text-sm text-red-600'>Mật khẩu nhập lại không đúng</p> */}
								<input
									type="password"
									placeholder='Nhập lại mật khẩu'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
									className="w-full ps-4 pe-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
						<p className="mt-4 text-start text-gray-600">
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
