import React from 'react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
			onClick={onClose}>
			<div className="relative w-full max-w-[40%] min-h-[30vh] max-h-[80vh] flex flex-col items-center justify-start 
				p-6 bg-white rounded-xl shadow-lg"
				onClick={(e) => e.stopPropagation()}>
				<button className="absolute top-4 right-4 text-2xl text-gray-700 font-semibold 
					rounded-full p-1 bg-gray-200 hover:bg-gray-300"
					onClick={onClose}>
					<IoClose />
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
