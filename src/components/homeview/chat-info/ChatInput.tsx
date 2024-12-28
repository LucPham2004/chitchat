import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useState } from 'react';
import { FaFaceGrinWide } from 'react-icons/fa6';
import { IoIosImages } from 'react-icons/io';
import { PiPaperPlaneRightFill } from 'react-icons/pi';

interface ChatInputProps {
	setMessage: (message: string) => void;
	sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
	message: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ setMessage, sendMessage, message }) => {
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
			sendMessage(event as unknown as React.FormEvent<HTMLFormElement>);
		}
	};

	return (
		<form className="flex items-center p-2 min-w-full" onSubmit={sendMessage}>
			{/* File Upload Button */}
			<label className="cursor-pointer text-xl text-gray-500 hover:text-gray-700 bg-white 
				p-2 me-1 rounded-full hover:bg-gray-200">
				<input
					type="file"
					accept="image/*,video/*"
					className="hidden"
					onChange={handleFileChange}
				/>
				<IoIosImages />
			</label>

			<div className='relative w-full'>
				{/* Text Input */}
				<input
					className="flex-grow w-full rounded-full bg-gray-100 border px-3 py-2 text-sm focus:outline-none"
					type="text"
					placeholder="Aa"
					value={message}
					onChange={({ target: { value } }) => setMessage(value)}
					onKeyPress={handleKeyPress}
				/>
				<div className='absolute right-1 top-1 text-xl text-blue-400 p-2 rounded-full 
					hover:bg-gray-200 cursor-pointer'
					onClick={() => setShowEmojiPicker(prev => !prev)}>
					<FaFaceGrinWide />
				</div>
			</div>
			{/* Emoji Picker */}
			{showEmojiPicker && (
				<div className="absolute bottom-[60px] right-0">
					<EmojiPicker width={420} height={340} onEmojiClick={handleEmojiClick} />
				</div>
			)}

			{message.trim() ? (
				<button
					className="ml-2 text-xl bg-white text-blue-600 p-2 rounded-full hover:bg-gray-200"
					type="submit"
				>
					<PiPaperPlaneRightFill />
				</button>
			) : (
				<button
					type="button"
					className="ml-2 text-xl bg-white text-blue-600 p-1 rounded-full hover:bg-gray-200"
					onClick={handleSendEmoji}
				>
					🐧
				</button>
			)}
		</form>
	);
};

export default ChatInput;
