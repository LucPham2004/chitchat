import React from 'react';
import { IoClose } from 'react-icons/io5';
import { useTheme } from '../../utilities/ThemeContext';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	const { isDarkMode  } = useTheme();
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
			onClick={onClose}>
			<div className={`relative min-w-[30%] max-w-[40%] min-h-[30vh] max-h-[80vh] flex flex-col items-center justify-start 
				p-6 rounded-xl shadow-lg ${isDarkMode ? 'text-white bg-[#2E2E2E]' : 'text-black bg-white'}`}
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
