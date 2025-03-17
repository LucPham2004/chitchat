import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useRef, useState } from 'react';
import '../../../../styles/scrollbar.css';
import { FaFaceGrinWide, FaVideo } from 'react-icons/fa6';
import { IoIosImages, IoMdClose } from 'react-icons/io';
import { PiPaperPlaneRightFill } from 'react-icons/pi';
import { useTheme } from '../../../../utilities/ThemeContext';

interface ChatInputProps {
	setMessage: React.Dispatch<React.SetStateAction<string>>;
	sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
	message: string;
	files: File[];
	setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const ChatInput: React.FC<ChatInputProps> = ({ setMessage, sendMessage, message, files, setFiles }) => {
	const { isDarkMode } = useTheme();
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	const handleWheel = (e: React.WheelEvent) => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft += e.deltaY;
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			setFiles(selectedFiles); // Store all selected files in the state
			console.log(selectedFiles)
		}
	};

	const handleEmojiClick = (emojiData: EmojiClickData) => {
		setTimeout(() => {
			setMessage((prevMessage) => prevMessage + emojiData.emoji);
		}, 0);
	};

	const handleSendEmoji = () => {
		setMessage('🐧');
	};


	return (
		<form className="relative flex flex-col p-2 w-full min-w-0" onSubmit={sendMessage}>

			{/* File Preview */}
			{files.length > 0 && (
				<div className="flex gap-2 overflow-x-auto w-full custom-scrollbar"
					ref={scrollRef}
					onWheel={handleWheel}>
					{files.map((file, index) => (
						<div key={index} className="relative min-h-20 min-w-20 mt-4 mb-2">
							{file.type.startsWith('image/') ? (
								<img
									src={URL.createObjectURL(file)}
									alt={file.name}
									className="h-20 w-20 object-cover rounded"
								/>
							) : file.type.startsWith('video/') ? (
								<video
									src={URL.createObjectURL(file)}
									className="h-20 w-20 object-cover rounded"
								/>
							) : (
								<div className="flex items-center">
									<FaVideo className="text-blue-500" />
									<span className="ml-2">{file.name}</span>
								</div>
							)}
							<button
								type="button"
								className={`absolute -top-2 -right-2 text-lg text-gray-200 p-1 rounded-full
							${isDarkMode ? 'bg-[#3A3A3A] hover:bg-[#5A5A5A]' : 'hover:bg-gray-200'}`}
								onClick={() => setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))}
							>
								<IoMdClose />
							</button>
						</div>
					))}
				</div>
			)}

			<div className='flex items-end gap-2 mt-2'>
				{/* File Upload Button */}
				<label className={`cursor-pointer text-xl p-2 me-1 rounded-full
				${isDarkMode ? 'hover:bg-[#5A5A5A] text-gray-300 hover:text-gray-200'
						: 'text-gray-500 hover:text-gray-700 bg-white'}`}>
					<input
						type="file"
						multiple
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
								sendMessage({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>);

								setMessage('');
								setFiles([])
								e.currentTarget.style.height = 'auto';
								setShowEmojiPicker(false);
							}
						}}
						onPaste={(e) => {
							const items = e.clipboardData.items;
							for (let i = 0; i < items.length; i++) {
								const item = items[i];
								if (item.type.indexOf("image") !== -1) {
									const blob = item.getAsFile();
									if (blob) {
										setFiles((prevFiles) => [...prevFiles, blob]);
									}
									e.preventDefault();
								}
							}
						}}
					/>

					<div className={`absolute right-0 bottom-0.5 text-xl text-blue-400 p-2 rounded-full 
					${isDarkMode ? 'hover:bg-[#5A5A5A]' : 'hover:bg-gray-200'} cursor-pointer`}
						onClick={() => setShowEmojiPicker(true)}>
						<FaFaceGrinWide />
					</div>
				</div>
				{/* Emoji Picker */}
				{showEmojiPicker && (
					<div className="absolute bottom-10 right-16">
						<EmojiPicker width={360} height={340} onEmojiClick={handleEmojiClick} />
					</div>
				)}

				{message.trim() || files.length > 0 ? (
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
			</div>

		</form>
	);
};

export default ChatInput;
