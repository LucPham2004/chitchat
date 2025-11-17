import { FaEllipsisH, FaFileAlt, FaPlus, FaReply, FaSmile, FaTrash } from "react-icons/fa";
import { ConversationResponse } from "../../../../types/Conversation";
import { ChatResponse } from "../../../../types/Message";
import { ChatParticipants } from "../../../../types/User";
import { useAuth } from "../../../../utilities/AuthContext";
import { useTheme } from "../../../../utilities/ThemeContext";
import { useEffect, useState } from "react";
import { deleteMessage } from "../../../../services/MessageService";
import { createMessageMessageEmojiReaction, deleteMessageMessageEmojiReaction } from "../../../../services/MessageEmojiReactionService";
import { MessageEmojiReaction } from "../../../../types/MessageEmojiReaction";
import { PhoneOff, Video, Phone, Clock, ImageIcon, Reply } from "lucide-react";
import { formatTimeHHmm } from "../../../../utilities/TimeUltilities";
import { ParseMessageLinks } from "../../../common/ParseMessageLinks";
import React from "react";
import useDeviceTypeByWidth from "../../../../utilities/DeviceType";



interface MessageProps {
	message: ChatResponse | any;
	isFirstInGroup: boolean;
	isLastInGroup: boolean;
	isSingleMessage: boolean;
	isLastMessageByCurrentUser?: boolean;
	isNextMessageShowDateSeparator?: boolean;
	conversationResponse?: ConversationResponse;
	participants?: ChatParticipants[];
	onDeleteMessage?: (id: string) => void;
	setDisplayMediaUrl: (url: string) => void;
	setIsDisplayMedia: (open: boolean) => void;
	onReply: React.Dispatch<React.SetStateAction<ChatResponse | null>>;
    showToast: (content: string, status: string) => void;
}

const ChatMessage: React.FC<MessageProps> = ({
	message, isFirstInGroup, isLastInGroup, isSingleMessage,
	isLastMessageByCurrentUser, 
	isNextMessageShowDateSeparator, 
	conversationResponse,
	participants, onDeleteMessage, setDisplayMediaUrl,
	setIsDisplayMedia, onReply, showToast,
}) => {

	const { user } = useAuth();
	const { isDarkMode } = useTheme();
    const deviceType = useDeviceTypeByWidth();
	const [messageReactions, setMessageReactions] = useState<MessageEmojiReaction[]>([]);

	const [activeEmojiPicker, setActiveEmojiPicker] = useState<number | null>(null);
	const [activeMenuMessage, setActiveMenuMessage] = useState<number | null>(null);

	const isMissed = message.callStatus === "MISSED" || message.callStatus === "REJECTED";

	const emojis = ["😂", "❤️", "👍", "😢", "🔥", "😡"];

	const toggleEmojiPicker = (messageId: number) => {
		setActiveEmojiPicker(activeEmojiPicker === messageId ? null : messageId);
		setActiveMenuMessage(null);
	};

	const toggleMenuMessage = (messageId: number) => {
		setActiveMenuMessage(activeMenuMessage === messageId ? null : messageId);
		setActiveEmojiPicker(null);
	};

	const splitLongWords = (text?: string, maxLength = 20) => {
		if (!text) return '';
		return text.replace(/\S{21,}/g, (match) => {
			return match.match(new RegExp(`.{1,${maxLength}}`, "g"))?.join(" ") ?? match;
		});
	};

	function formatDuration(sec: number) {
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}m ${s}s`;
	}

	const isOnlyEmoji = (text: string) => {
		if (!text) return false;
		const stringToTest = text.replace(/ /g, '');
		const emojiRegex = /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
		return emojiRegex.test(stringToTest) && Number.isNaN(Number(stringToTest));
	};

	const isVideoUrl = (url: string): boolean => {
		const videoExtensions = ['.mp4', '.webm', '.mov', '.mkv'];
		return videoExtensions.some(ext => url.toLowerCase().includes(ext));
	};

	const isMatchingSender = (senderId: string) => {
		return participants?.find(participant => participant.id === senderId);
	}

	const handleSelectEmoji = async (messageId: string, emoji: string) => {
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

				if (response.code == 200) {
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
				showToast("Xoá tin nhắn thành công", "success");
			}
		} catch (error) {
			console.error("Lỗi khi xoá tin nhắn:", error);
			showToast("Lỗi khi xoá tin nhắn", "error");
		}
	};

	useEffect(() => {
		setActiveEmojiPicker(null);
		setActiveMenuMessage(null);
	}, [message]);

	useEffect(() => {
		setMessageReactions(message.reactions || []);
	}, [message.reactions]);

	const baseClasses = `
		flex justify-center w-full py-[1.5px]
	`;

	const bubbleClasses = `
		relative max-w-xs w-fit px-4 py-3 rounded-2xl shadow-sm
		flex flex-col gap-1.5 transition-all duration-200
		${isDarkMode ? 'shadow-gray-900/50' : 'shadow-gray-200/50'}
		${isMissed
			? isDarkMode
				? 'bg-red-900/30 border border-red-800/50 text-red-300'
				: 'bg-red-50 border border-red-200 text-red-600'
			: isDarkMode
				? 'bg-emerald-900/30 border border-emerald-800/50 text-emerald-300'
				: 'bg-emerald-50 border border-emerald-200 text-emerald-600'
		}
	`;

	const iconColor = isMissed
		? isDarkMode ? 'text-red-400' : 'text-red-600'
		: isDarkMode ? 'text-emerald-400' : 'text-emerald-600';

	return (
		<div className={`relative flex items-end group 
			${message.senderId === user?.user.id ? 'justify-end' : 'justify-start gap-2'}
			${isLastInGroup ? 'mb-2' : ''}
			${message.replyTo ? (message.publicIds != null && message.publicIds != "") ? 'mt-24' : 'mt-16' : ''}
			`}>
			{/* Hiển thị ảnh đại diện nếu là tin nhắn cuối của nhóm tin nhắn */}
			{message.senderId !== user?.user.id && (isLastInGroup || isNextMessageShowDateSeparator) && conversationResponse?.avatarUrls && (
				<img
					src={isMatchingSender(message.senderId)?.avatarUrl || '/images/user_default.avif'}
					className="border border-sky-600 rounded-[100%] h-8 w-8 object-cover"
					alt="avatar"
				/>
			)}

			{/* Nút reaction và menu khi hover vào tin nhắn */}
			<div className={`relative self-center flex items-center opacity-0 scale-95 gap-1 me-6 transition-all duration-400 z-40
				${message.senderId === user?.user.id ? 'left-4 group-hover:opacity-100 group-hover:scale-100' : 'hidden'}`}>

				<p className={`text-xs text-gray-800 bg-[#ffffffb2] px-1.5 py-1 font-semibold rounded-xl`}>
					{formatTimeHHmm(message.createdAt)}
				</p>

				<button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-700 border-gray-700 hover:text-gray-600 bg-[#ffffffa0]'}`}
					onClick={() => toggleEmojiPicker(message.id)}>
					<FaSmile />
				</button>

				<button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-700 border-gray-700 hover:text-gray-600 bg-[#ffffffa0]'}`}
					onClick={() => onReply(message)}>
					<FaReply />
				</button>

				{/* Popup emoji */}
				{activeEmojiPicker === message.id && activeMenuMessage !== message.id && (
					<div className={`absolute -left-28 bottom-5 mb-2 p-2 
						shadow-md rounded-full flex gap-0.5 z-40
						${isDarkMode ? 'bg-[#161618d5]' : 'bg-[#ffffffa0]'}`}>
						{emojis.map((emoji, index) => (
							<button key={index} className="text-2xl hover:scale-110 transition"
								onClick={() => handleSelectEmoji(message.id, emoji)}>
								{emoji}
							</button>
						))}
						{/* <button className="py-1 px-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400">
							<FaPlus className="text-sm text-gray-700 dark:text-gray-200" />
						</button> */}
					</div>
				)}

				<button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-700 border-gray-700 hover:text-gray-600 bg-[#ffffffa0]'}`}
					onClick={() => toggleMenuMessage(message.id)}>
					<FaEllipsisH />
				</button>

				{/* Menu xóa tin nhắn */}
				{message.senderId === user?.user.id && activeMenuMessage === message.id && activeEmojiPicker !== message.id && (
					<div className="absolute -right-12 bottom-6 mb-2 p-2 bg-white dark:bg-[#161618] shadow-md rounded-lg z-40">
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

			{message.replyTo && (
				<div className={`absolute transition-all duration-200 hover:scale-[1.01] max-w-[70%] z-0
					${message.senderId == user?.user.id ? 'right-0' : 'left-10'}
					${(message.publicIds != null && message.publicIds != "") ? '-top-20' : '-top-14'}`}>
					<div className={`relative overflow-hidden rounded-lg shadow-lg backdrop-blur-sm ${isDarkMode
						? 'bg-gradient-to-r from-gray-800/45 to-gray-700/45 border border-gray-600/50'
						: 'bg-gradient-to-r from-white/45 to-gray-50/45 border border-gray-200/50'
						}`}>
						{/* Thanh màu accent bên trái */}
						<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />

						<div className="flex items-start gap-2 p-2 pl-3">
							{/* Icon Reply */}
							<div className={`flex-shrink-0 mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'
								}`}>
								<Reply size={16} />
							</div>

							{/* Nội dung chính */}
							<div className="flex-1 min-w-0">
								{/* Header - Người gửi */}
								<div className="flex items-center gap-1 mb-1">
									<span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
										}`}>
										{user?.user.id === message.senderId ? 'Bạn' : isMatchingSender(message.senderId)?.fullName}
									</span>
									<span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
										}`}>
										đã trả lời
									</span>
									<span className={`text-xs font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
										}`}>
										{message.replyTo.senderId == user?.user.id ? 'chính mình' : isMatchingSender(message.replyTo.senderId)?.fullName || 'một người'}
									</span>
								</div>

								{/* Nội dung tin nhắn */}
								<div className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
									}`}>
									<p className="whitespace-pre-wrap line-clamp-2">
										{message.replyTo.content || (
											<span className="flex items-center gap-1.5 italic">
												<ImageIcon size={14} />
												Tin nhắn đa phương tiện
											</span>
										)}
									</p>
								</div>
							</div>

							{/* Preview ảnh/media */}
							{message.replyTo.urls && message.replyTo.urls.length > 0 && (
								<div className="flex-shrink-0">
									<div className={`relative w-12 h-12 rounded-lg overflow-hidden ring-2 ${isDarkMode ? 'ring-gray-600' : 'ring-gray-200'
										}`}>
										<img
											src={message.replyTo.urls[0]}
											alt="preview"
											className="w-full h-full object-cover"
										/>
										{message.replyTo.urls.length > 1 && (
											<div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${isDarkMode ? 'bg-gray-900/60' : 'bg-white/60'
												}`}>
												<span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'
													}`}>
													+{message.replyTo.urls.length - 1}
												</span>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}


			<div className={`relative flex flex-col max-w-[60%] gap-0.5
				${message.senderId === user?.user.id ? 'items-end justify-end' : 'items-start justify-start'}
				${messageReactions.length > 0 && !isLastInGroup ? 'mb-4' : ''}
				`}>

				{message.content && message.type != 'CALL' && (
					<div className={`relative inline-flex pt-1 pb-1.5 
					
					${isOnlyEmoji(message.content) ? '' : `${message.senderId === user?.user.id
							? ` text-white px-3 ${isDarkMode ? 'bg-[#ff000090]' : 'bg-[#ff0000c2]'}`
							: `${isDarkMode ? 'bg-[#27221ba0] text-gray-300 px-3' : 'bg-[#F3F3F3] px-3'} `} `}
					
					${isSingleMessage // Nếu là tin nhắn đơn
							? message.senderId === user?.user.id ? 'rounded-[20px]' : `rounded-[20px]`
							: isFirstInGroup // Nếu là tin nhắn đầu trong chuỗi tin nhắn
								? message.senderId === user?.user.id
									? 'rounded-t-[20px] rounded-bl-[20px] rounded-br-[4px]' // Người dùng hiện tại
									: 'rounded-t-[20px] rounded-br-[20px] rounded-bl-[4px] ms-10' // Người gửi khác
								: isLastInGroup // Nếu là tin nhắn cuối trong chuỗi tin nhắn
									? message.senderId === user?.user.id
										? 'rounded-b-[20px] rounded-tl-[20px] rounded-tr-[4px]' // Người dùng hiện tại
										: 'rounded-b-[20px] rounded-tr-[20px] rounded-tl-[4px]' // Người gửi khác
									: message.senderId === user?.user.id // Nếu là tin nhắn giữa trong chuỗi tin nhắn
										? 'rounded-l-[20px] rounded-r-[4px]' // Người dùng hiện tại
										: 'rounded-r-[20px] rounded-l-[4px] ms-10' // Người gửi khác
						} `}
					>
						<div className={`whitespace-pre-wrap break-words 
    						${isOnlyEmoji(message.content) ? 'text-4xl' : 'text-[15px]'}`}>
							{ParseMessageLinks(message.content).map((part, index) => (
								<div key={index} >
									{part.type === 'text' && (
										<span className="inline-flex">
											{part.content}
										</span>
									)}

									{part.type === 'link' && (
										<a
											href={part.url}
											target="_blank"
											rel="noopener noreferrer"
											className={`block hover:underline break-all font-semibold
												${isDarkMode ? 'text-blue-400' : 'text-blue-300'}`}
										>
											{part.display} {/* Hiển thị URL gốc */}
										</a>
									)}
								</div>
							))}
						</div>

						{messageReactions.length > 0 && (() => {
							const uniqueEmojis = [...new Set(messageReactions.map(r => r.emoji))];

							return (
								<div
									className={`absolute -bottom-4 flex gap-[1px] mt-1 cursor-pointer z-40 right-0
										${isDarkMode ? 'bg-[#30303090]' : 'bg-[#8c8c8c8c]'} rounded-full`}
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
					<div className={`flex flex-col gap-[1px] 
					${message.senderId === user?.user.id ? 'items-end justify-end' : 'items-start justify-start gap-2'}`}>
						{message.publicIds.map((publicId: string, index: number) => {
							const url = message.urls[index];
							const isImage = message.resourceTypes[index] === 'image';
							const isVideo = isVideoUrl(url);
							const aspectRatio = message.widths[index] / message.heights[index];
							const widthPercentage = aspectRatio > 1.33 ? '80%' : `${aspectRatio < 0.75 ? '40%' : '60%'}`;

							// w-[${isImage || isVideo ? widthPercentage : ''}]
							return (
								<div key={publicId} className={`relative max-h-[450px] max-w-[450px] min-w-[100px] cursor-pointer
          								${!isLastInGroup ? 'ms-10' : ''}`}>

									{isVideo && (
										<video src={url} controls className="w-full h-auto max-h-[450px] rounded-xl"
											onClick={() => {
												setDisplayMediaUrl(url);
												setIsDisplayMedia(true);
											}} />
									)}

									{isImage && (
										<div onClick={() => {
											setDisplayMediaUrl(url);
											setIsDisplayMedia(true);
										}}>
											<img loading="lazy" src={url} alt="A message media" className="w-full h-auto max-h-[450px] rounded-xl
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
													${isDarkMode ? 'bg-[#30303090]' : 'bg-[#8c8c8c8c]'} rounded-full`}
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

				{message.type && message.type == 'CALL' && (
					<div className={`relative inline-flex
					
					${isSingleMessage // Nếu là tin nhắn đơn
							? message.senderId === user?.user.id ? 'rounded-[20px]' : `rounded-[20px]`
							: isFirstInGroup // Nếu là tin nhắn đầu trong chuỗi tin nhắn
								? message.senderId === user?.user.id
									? 'rounded-t-[20px] rounded-bl-[20px] rounded-br-[4px]' // Người dùng hiện tại
									: 'rounded-t-[20px] rounded-br-[20px] rounded-bl-[4px] ms-10' // Người gửi khác
								: isLastInGroup // Nếu là tin nhắn cuối trong chuỗi tin nhắn
									? message.senderId === user?.user.id
										? 'rounded-b-[20px] rounded-tl-[20px] rounded-tr-[4px]' // Người dùng hiện tại
										: 'rounded-b-[20px] rounded-tr-[20px] rounded-tl-[4px]' // Người gửi khác
									: message.senderId === user?.user.id // Nếu là tin nhắn giữa trong chuỗi tin nhắn
										? 'rounded-l-[20px] rounded-r-[4px]' // Người dùng hiện tại
										: 'rounded-r-[20px] rounded-l-[4px] ms-10' // Người gửi khác
						} `}
					>
						<div className={baseClasses}>
							<div className={bubbleClasses}>
								{/* Nội dung chính */}
								<p className="font-medium text-sm">{message.content}</p>

								{/* Thông tin cuộc gọi */}
								<div className="flex items-center gap-2 text-sm">
									{message.callType === 'video' ? (
										isMissed ? (
											<Video size={14} className={iconColor} />
										) : (
											<Video size={14} className={iconColor} />
										)
									) : isMissed ? (
										<PhoneOff size={14} className={iconColor} />
									) : (
										<Phone size={14} className={iconColor} />
									)}

									<span className="font-mono">{formatDuration(message.callDuration)}</span>
								</div>

								{/* Hiệu ứng viền nhẹ khi nhắn lỡ */}
								{isMissed && (
									<div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-red-500/20 to-transparent pointer-events-none -z-10" />
								)}
							</div>
						</div>
					</div>
				)}

			</div>

			{/* Nút reaction và menu khi hover vào tin nhắn */}
			<div className={`relative self-center flex items-center opacity-0 scale-95 gap-1 transition-all duration-400
					${message.senderId === user?.user.id ? 'hidden' : 'right-0 group-hover:opacity-100 group-hover:scale-100'}`}>
				<button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-700 border-gray-700 hover:text-gray-600 bg-[#ffffffa0]'}`}
					onClick={() => toggleEmojiPicker(message.id)}>
					<FaSmile />
				</button>

				<button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-700 border-gray-700 hover:text-gray-600 bg-[#ffffffa0]'}`}
					onClick={() => onReply(message)}>
					<FaReply />
				</button>

				{/* Popup emoji */}
				{activeEmojiPicker === message.id && activeMenuMessage !== message.id && (
					<div className="absolute -right-24 bottom-5 mb-2 p-2 bg-white dark:bg-[#161618]
						shadow-md rounded-full flex gap-0.5 z-40">
						{emojis.map((emoji, index) => (
							<button key={index} className="text-2xl hover:scale-110 transition"
								onClick={() => handleSelectEmoji(message.id, emoji)}>
								{emoji}
							</button>
						))}
						{/* <button className="py-1 px-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400">
							<FaPlus className="text-sm text-gray-700 dark:text-gray-200" />
						</button> */}
					</div>
				)}

				{/* <button className={`py-1.5 px-1.5 rounded-full text-md border
					${isDarkMode ? 'text-gray-400 border-gray-600 bg-[#150C07] hover:text-gray-200'
						: 'text-gray-300 border-gray-300 hover:text-gray-200'}`}>
					<FaEllipsisH />
				</button> */}
				<p className={`text-xs text-gray-800 bg-[#ffffffb2] px-1.5 py-1 font-semibold rounded-xl`}>
					{formatTimeHHmm(message.createdAt)}
				</p>
			</div>

			{isLastMessageByCurrentUser &&
				<div className={`absolute -bottom-6 right-1 text-xs w-max
					${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>Đã gửi</div>
			}
		</div>
	);

}

export default ChatMessage


