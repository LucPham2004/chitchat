import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useState } from 'react';
import { FaFaceGrinWide } from 'react-icons/fa6';
import { IoIosImages } from 'react-icons/io';
import { PiPaperPlaneRightFill } from 'react-icons/pi';
import { useTheme } from '../../../../utilities/ThemeContext';

interface ChatInputProps {
	setMessage: (message: string) => void;
	sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
	message: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ setMessage, sendMessage, message }) => {
	const { isDarkMode  } = useTheme();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
			alert(`Selected file: ${event.target.files[0].name}`);
		}
	};

	const handleEmojiClick = (emojiData: EmojiClickData) => {
		setMessage(message + emojiData.emoji);
		setShowEmojiPicker(false);
	};

	const handleSendEmoji = () => {
		setMessage('🐧');
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			sendMessage(event as unknown as React.FormEvent<HTMLFormElement>);
		}
	};

	return (
		<form className="relative flex items-end p-2 w-full min-w-0" onSubmit={sendMessage}>
			{/* File Upload Button */}
			<label className={`cursor-pointer text-xl p-2 me-1 rounded-full
				${isDarkMode ? 'hover:bg-[#5A5A5A] text-gray-300 hover:text-gray-200'
					: 'text-gray-500 hover:text-gray-700 bg-white'}`}>
				<input
					type="file"
					accept="image/*,video/*"
					className="hidden"
					onChange={handleFileChange}
				/>
				<IoIosImages />
			</label>

			<div className={`relative w-full rounded-[20px] flex items-center justify-center
				${isDarkMode ? 'text-gray-200 bg-[#2D2A28] border-gray-700' 
							: 'text-black bg-gray-100 border-gray-200'} pe-8`}>
				{/* Text Input */}
				<textarea
					className={`flex-grow w-full rounded-[20px] px-3 p-2 text-[14px] resize-none 
						overflow-y-auto focus:outline-none
    					${isDarkMode ? 'text-gray-200 bg-[#2D2A28] ' 
							: 'text-black bg-gray-100 '}`}
					placeholder="Aa"
					value={message}
					rows={1}
					style={{ lineHeight: '1.5', maxHeight: 'calc(1.5em * 6.5 + 0.5rem)', minHeight: '1.5em' }}
					onChange={(e) => {
						setMessage(e.target.value);
						
						e.target.style.height = 'auto';
						e.target.style.height = `${Math.min(e.target.scrollHeight, parseFloat(getComputedStyle(e.target).lineHeight) * 6.5)}px`;
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							sendMessage({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);

							setMessage('');
            				e.currentTarget.style.height = 'auto';
						}
					}}
				/>

				<div className={`absolute right-0 bottom-0.5 text-xl text-blue-400 p-2 rounded-full 
					${isDarkMode ? 'hover:bg-[#5A5A5A]' : 'hover:bg-gray-200'} cursor-pointer`}
					onClick={() => setShowEmojiPicker(prev => !prev)}>
					<FaFaceGrinWide />
				</div>
			</div>
			{/* Emoji Picker */}
			{showEmojiPicker && (
				<div className="absolute bottom-10 right-16">
					<EmojiPicker width={360} height={340} onEmojiClick={handleEmojiClick} />
				</div>
			)}

			{message.trim() ? (
				<button
					className={`ml-2 text-xl text-blue-600 p-2 rounded-full
						${isDarkMode ? 'hover:bg-[#5A5A5A]' : 'hover:bg-gray-200'}`}
					type="submit"
				>
					<PiPaperPlaneRightFill />
				</button>
			) : (
				<button
					type="button"
					className={`ml-2 text-xl text-blue-600 p-1 rounded-full
						${isDarkMode ? 'hover:bg-[#5A5A5A]' : 'hover:bg-gray-200'}`}
					onClick={handleSendEmoji}
				>
					🐧
				</button>
			)}
		</form>
	);
};

export default ChatInput;
