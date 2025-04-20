import { FaEllipsisH, FaFileAlt, FaPlus, FaSmile, FaTrash } from "react-icons/fa";
import { ConversationResponse } from "../../../../types/Conversation";
import { ChatResponse } from "../../../../types/Message";
import { ChatParticipants } from "../../../../types/User";
import { useAuth } from "../../../../utilities/AuthContext";
import { useTheme } from "../../../../utilities/ThemeContext";
import { useEffect, useState } from "react";
import { deleteMessage } from "../../../../services/MessageService";
import { createMessageMessageEmojiReaction, deleteMessageMessageEmojiReaction } from "../../../../services/MessageEmojiReactionService";
import { MessageEmojiReaction } from "../../../../types/MessageEmojiReaction";
import { Link } from "react-router-dom";


interface MessageProps {
	message: ChatResponse | any;
	isFirstInGroup: boolean;
	isLastInGroup: boolean;
	isSingleMessage: boolean;
	isLastMessageByCurrentUser?: boolean;
	conversationResponse?: ConversationResponse;
	participants?: ChatParticipants[];
	onDeleteMessage?: (id: number) => void;
	setDisplayMediaUrl: (url: string) => void;
	setIsDisplayMedia: (open: boolean) => void;
}

const ChatMessage: React.FC<MessageProps> = ({
	message, isFirstInGroup, isLastInGroup, isSingleMessage,
	isLastMessageByCurrentUser, conversationResponse,
	participants, onDeleteMessage, setDisplayMediaUrl,
	setIsDisplayMedia
}) => {

	const { user } = useAuth();
	const { isDarkMode } = useTheme();
	const [messageReactions, setMessageReactions] = useState<MessageEmojiReaction[]>([]);

	const [activeEmojiPicker, setActiveEmojiPicker] = useState<number | null>(null);
	const [activeMenuMessage, setActiveMenuMessage] = useState<number | null>(null);

	const emojis = ["😂", "❤️", "👍", "😢", "🔥", "😡"];

	const toggleEmojiPicker = (messageId: number) => {
		setActiveEmojiPicker(activeEmojiPicker === messageId ? null : messageId);
		setActiveMenuMessage(null);
	};

	const toggleMenuMessage = (messageId: number) => {
		setActiveMenuMessage(activeMenuMessage === messageId ? null : messageId);
		setActiveEmojiPicker(null);
	};

	const splitLongWords = (text: string, maxLength = 20) => {
		return text.replace(/\S{21,}/g, (match) => {
			return match.match(new RegExp(`.{1,${maxLength}}`, "g"))?.join(" ") ?? match;
		});
	};

	const isOnlyEmoji = (text: string) => {
		if (!text) return false;
		const stringToTest = text.replace(/ /g, '');
		const emojiRegex = /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
		return emojiRegex.test(stringToTest) && Number.isNaN(Number(stringToTest));
	};

	const isVideoUrl = (url: string): boolean => {
		const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
		return videoExtensions.some(ext => url.toLowerCase().includes(ext));
	};

	const isMatchingSender = (senderId: number) => {
		return participants?.find(participant => participant.id === senderId);
	}

	const handleSelectEmoji = async (messageId: number, emoji: string) => {
		if (!user?.user.id) return; // Kiểm tra userId trước khi gọi API

		try {
			const response = await createMessageMessageEmojiReaction(user.user.id, messageId, emoji);
			console.log(response.result);
			console.log(`Đã gửi reaction ${emoji} cho tin nhắn ${messageId}`);

			setMessageReactions(prev => response.result ? [...prev, response.result] : prev);

			// Đóng emoji picker sau khi chọn
			setActiveEmojiPicker(null);
		} catch (error) {
			console.error("Lỗi khi gửi reaction:", error);
		}
	};

	const handleDeleteMessageReaction = async () => {
		try {
			if (message.id != undefined && user?.user) {
				const response = await deleteMessageMessageEmojiReaction(user.user.id, message.id);

				if(response.code == 200) {
					console.log("Tin nhắn reaction đã bị xoá: message id:" + message.id + " user id: " + user.user.id);
	
					setMessageReactions(prev =>
						prev.filter(reaction => reaction.userId !== user.user.id)
					);
				}
			}
		} catch (error) {
			console.error("Lỗi khi xoá tin nhắn:", error);
		}
	};

	const handleDeleteMessage = async () => {
		try {
			if (message.id != undefined) {
				await deleteMessage(message.id);
				console.log("Tin nhắn đã bị xoá:", message.id);
				onDeleteMessage?.(message.id);
			}
		} catch (error) {
			console.error("Lỗi khi xoá tin nhắn:", error);
		}
	};

	useEffect(() => {
		setActiveEmojiPicker(null);
		setActiveMenuMessage(null);
	}, [message]);

	useEffect(() => {
		setMessageReactions(message.reactions || []);
	}, [message.reactions]);

	return (
		<div className={`relative flex items-end group 
			${message.senderId === user?.user.id ? 'justify-end' : 'justify-start gap-2'}
			${isLastInGroup && 'mb-4'}
			`}>
			{/* Hiển thị ảnh đại diện nếu là tin nhắn cuối của nhóm tin nhắn */}
			{message.senderId !== user?.user.id && isLastInGroup && conversationResponse?.avatarUrls && (
				<img
					src={isMatchingSender(message.senderId)?.avatarUrl}
					className="border border-sky-600 rounded-[100%] h-8 w-8 object-cover"
					alt="avatar"
				/>
			)}

			{/* Nút reaction và menu khi hover vào tin nhắn */}
			<div className={`relative self-center hidden gap-1 me-6
				${message.senderId === user?.user.id ? 'left-4 group-hover:flex' : 'hidden'}`}>
				<button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-300 border-gray-300 hover:text-gray-200'}`}
					onClick={() => toggleEmojiPicker(message.id)}>
					<FaSmile />
				</button>

				{/* Popup emoji */}
				{activeEmojiPicker === message.id && activeMenuMessage !== message.id && (
					<div className="absolute -left-28 bottom-5 mb-2 p-2 bg-white dark:bg-[#1F1F1F] 
						shadow-md rounded-full flex gap-0.5 z-40">
						{emojis.map((emoji, index) => (
							<button key={index} className="text-2xl hover:scale-110 transition"
								onClick={() => handleSelectEmoji(message.id, emoji)}>
								{emoji}
							</button>
						))}
						<button className="py-1 px-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400">
							<FaPlus className="text-sm text-gray-700 dark:text-gray-200" />
						</button>
					</div>
				)}

				<button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-300 border-gray-300 hover:text-gray-200'}`}
					onClick={() => toggleMenuMessage(message.id)}>
					<FaEllipsisH />
				</button>

				{/* Menu xóa tin nhắn - chỉ hiển thị nếu tin nhắn này được chọn */}
				{activeMenuMessage === message.id && activeEmojiPicker !== message.id && (
					<div className="absolute -right-12 bottom-6 mb-2 p-2 bg-white dark:bg-[#1F1F1F] shadow-md rounded-lg z-40">
						<button
							className="flex items-center text-sm w-max gap-2 p-1 text-red-500 hover:text-red-700"
							onClick={handleDeleteMessage}
						>
							<FaTrash />
							Xoá tin nhắn
						</button>
					</div>
				)}
			</div>

			<div className={`relative flex flex-col max-w-[70%] gap-0.5
				${message.senderId === user?.user.id ? 'items-end justify-end' : 'items-start justify-start'}
				${messageReactions.length > 0 && !isLastInGroup && 'mb-4'}
				`}>

				{message.content && (
					<div className={`relative inline-flex pt-1 pb-1.5 
					
					${isOnlyEmoji(message.content) ? '' : `${message.senderId === user?.user.id
							? 'bg-[#EA1A1A] text-white px-3'
							: `${isDarkMode ? 'bg-[#27221B] text-gray-300 px-3' : 'bg-[#F3F3F3] px-3'} `} `}
					
					${isSingleMessage // Nếu là tin nhắn đơn
							? message.senderId === user?.user.id ? 'rounded-[20px]' : 'rounded-[20px] mt-6'
							: isFirstInGroup // Nếu là tin nhắn đầu trong chuỗi tin nhắn
								? message.senderId === user?.user.id
									? 'rounded-t-[20px] rounded-bl-[20px] rounded-br-[4px]' // Người dùng hiện tại
									: 'rounded-t-[20px] rounded-br-[20px] rounded-bl-[4px] ms-10 mt-6' // Người gửi khác
								: isLastInGroup // Nếu là tin nhắn cuối trong chuỗi tin nhắn
									? message.senderId === user?.user.id
										? 'rounded-b-[20px] rounded-tl-[20px] rounded-tr-[4px]' // Người dùng hiện tại
										: 'rounded-b-[20px] rounded-tr-[20px] rounded-tl-[4px]' // Người gửi khác
									: message.senderId === user?.user.id // Nếu là tin nhắn giữa trong chuỗi tin nhắn
										? 'rounded-l-[20px] rounded-r-[4px]' // Người dùng hiện tại
										: 'rounded-r-[20px] rounded-l-[4px] ms-10' // Người gửi khác
						} `}
					>
						<p className={`whitespace-normal break-words inline-flex 
    						${isOnlyEmoji(message.content) ? 'text-4xl' : 'text-[15px]'}`}>
							{splitLongWords(message.content)}
						</p>

						{messageReactions.length > 0 && (() => {
							const uniqueEmojis = [...new Set(messageReactions.map(r => r.emoji))];

							return (
								<div
									className={`absolute -bottom-4 flex gap-[1px] mt-1 cursor-pointer z-40 right-0
										${isDarkMode ? 'bg-[#303030]' : 'bg-[#444444]'} rounded-full`}
									onClick={handleDeleteMessageReaction}
								>
									{uniqueEmojis.map((emoji, index) => (
										<span key={index} className="text-md drop-shadow-[2px_2px_2px_black]">{emoji}</span>
									))}
									<p className={`text-gray-300 ${messageReactions.length > 1 ? "me-1" : ''}`}>
										{messageReactions.length > 1 ? messageReactions.length : ''}
									</p>
								</div>
							);
						})()}

						{isFirstInGroup && message.senderId !== user?.user.id && conversationResponse?.group &&
							<div className={`absolute -top-5 left-1 text-xs w-max ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
								{isMatchingSender(message.senderId)?.firstName + `${isMatchingSender(message.senderId)?.lastName ? ' ' + isMatchingSender(message.senderId)?.lastName : ''}`}
							</div>
						}
					</div>
				)}

				{/* Show images/videos/files */}
				{message.publicIds != null && message.publicIds != "" && (
					<div className={`flex flex-col gap-[1px] max-w-[100%]
					${message.senderId === user?.user.id ? 'items-end justify-end' : 'items-start justify-start gap-2'}`}>
						{message.publicIds.map((publicId: string, index: number) => {
							const url = message.urls[index];
							const isImage = message.resourceTypes[index] === 'image';
							const isVideo = isVideoUrl(url);
							const aspectRatio = message.widths[index] / message.heights[index];
							const widthPercentage = aspectRatio > 1.33 ? '80%' : `${aspectRatio < 0.75 ? '40%' : '60%'}`;

							return (
								<div key={publicId} className={`relative w-[${isImage || isVideo ? widthPercentage : ''}] max-w-[450px] min-w-[100px] cursor-pointer
          								${!isLastInGroup ? 'ms-10' : ''}`}>

									{isVideo && (
										<video src={url} controls className="w-full h-auto rounded-xl" 
											onClick={() => {
												setDisplayMediaUrl(url);
												setIsDisplayMedia(true);
											}}/>
									)}

									{isImage && (
										<div onClick={() => {
												setDisplayMediaUrl(url);
												setIsDisplayMedia(true);
											}}>
											<img loading="lazy" src={url} alt="A message media" className="w-full h-auto rounded-xl
											hover:brightness-110" />
										</div>
									)}

									{!isImage && !isVideo && (
										<div className="w-full">
											<a
												href={message.urls[index].replace("/upload/", "/upload/fl_attachment/")}
												download={message.fileNames[index]}
												target="blank" 
												className={`text-md font-medium hover:brightness-110
  													${isDarkMode ? 'text-gray-300' : 'text-gray-200'}`}
											>
												<div className={`p-2 w-full h-full flex items-center justify-center gap-2 rounded-lg
													${isDarkMode ? 'bg-[#474747]' : 'bg-[#5b5b5b]'}`}>
													<FaFileAlt className='text-2xl' />
													<p className='text-sm overflow-hidden text-ellipsis whitespace-nowrap'>{message.fileNames[index]}</p>
												</div>
											</a>
										</div>
									)}
									{messageReactions.length > 0 && (() => {
										const uniqueEmojis = [...new Set(messageReactions.map(r => r.emoji))];

										return (
											<div
												className={`absolute -bottom-4 flex gap-[1px] mt-1 cursor-pointer z-40 right-0 p-0.25
													${isDarkMode ? 'bg-[#303030]' : 'bg-[#444444]'} rounded-full`}
												onClick={handleDeleteMessageReaction}
											>
												{uniqueEmojis.map((emoji, index) => (
													<span key={index} className="text-md drop-shadow-[2px_2px_2px_black]">{emoji}</span>
												))}
												<p className={`text-gray-300 ${messageReactions.length > 1 ? "me-1" : ''}`}>
													{messageReactions.length > 1 ? messageReactions.length : ''}
												</p>
											</div>
										);
									})()}
								</div>
							);
						})}

						{isFirstInGroup && message.senderId !== user?.user.id && conversationResponse?.group &&
							<div className={`absolute -top-5 text-xs w-max 
								${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
								${!isSingleMessage ? 'left-11' : 'left-1'}`}>
								{isMatchingSender(message.senderId)?.firstName + `${isMatchingSender(message.senderId)?.lastName ? ' ' + isMatchingSender(message.senderId)?.lastName : ''}`}
							</div>
						}
					</div>
				)}

			</div>

			{/* Nút reaction và menu khi hover vào tin nhắn */}
			<div className={`relative self-center hidden gap-1 
					${message.senderId === user?.user.id ? 'hidden' : 'right-0 group-hover:flex'}`}>
				<button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-300 border-gray-300 hover:text-gray-200'}`}
					onClick={() => toggleEmojiPicker(message.id)}>
					<FaSmile />
				</button>

				{/* Popup emoji */}
				{activeEmojiPicker === message.id && activeMenuMessage !== message.id && (
					<div className="absolute -right-24 bottom-5 mb-2 p-2 bg-white dark:bg-[#1F1F1F]
						shadow-md rounded-full flex gap-0.5 z-40">
						{emojis.map((emoji, index) => (
							<button key={index} className="text-2xl hover:scale-110 transition"
								onClick={() => handleSelectEmoji(message.id, emoji)}>
								{emoji}
							</button>
						))}
						<button className="py-1 px-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400">
							<FaPlus className="text-sm text-gray-700 dark:text-gray-200" />
						</button>
					</div>
				)}

				<button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-300 border-gray-300 hover:text-gray-200'}`}>
					<FaEllipsisH />
				</button>
			</div>

			{isLastMessageByCurrentUser &&
				<div className={`absolute -bottom-6 right-1 text-xs w-max
					${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>Đã gửi</div>
			}
		</div>
	);

}

export default ChatMessage


