import React from 'react';
import { IoClose } from 'react-icons/io5';
import { useTheme } from '../../utilities/ThemeContext';
import useDeviceTypeByWidth from '../../utilities/DeviceType';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	const { isDarkMode  } = useTheme();
    const deviceType = useDeviceTypeByWidth();
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
			onClick={onClose}>
			<div className={`relative min-h-[30dvh] max-h-[80dvh] flex flex-col items-center justify-start 
				 rounded-xl shadow-lg 
				${deviceType == 'Mobile' ? 'max-w-[90%] p-4' : 'min-w-[30%] max-w-[40%] p-6'}
				${isDarkMode ? 'text-white bg-[#2E2E2E]' : 'text-black bg-white'}
				`}
				onClick={(e) => e.stopPropagation()}>
				<button className={`absolute top-4 right-4 text-2xl text-gray-700 font-semibold rounded-full p-1
					${isDarkMode ? 'text-white bg-[#474747] hover:bg-[#5A5A5A]' 
						: 'text-black bg-gray-100 hover:bg-gray-200'}`}
					onClick={onClose}>
					<IoClose />
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
