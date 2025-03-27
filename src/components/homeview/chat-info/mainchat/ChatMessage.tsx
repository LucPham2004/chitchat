import { ConversationResponse } from "../../../../types/Conversation";
import { ChatResponse } from "../../../../types/Message";
import { ChatParticipants } from "../../../../types/User";
import { useAuth } from "../../../../utilities/AuthContext";
import { useTheme } from "../../../../utilities/ThemeContext";


interface MessageProps {
	message: ChatResponse | any;
	isFirstInGroup: boolean;
	isLastInGroup: boolean;
	isSingleMessage: boolean;
	isLastMessageByCurrentUser?: boolean;
	conversationResponse?: ConversationResponse;
	participants?: ChatParticipants[];
}

const ChatMessage: React.FC<MessageProps> = ({
	message, isFirstInGroup, isLastInGroup, isSingleMessage, 
	isLastMessageByCurrentUser, conversationResponse,
	participants
}) => {

	const { user } = useAuth();
	const { isDarkMode } = useTheme();

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

	return (
		<div className={`relative flex items-end ${message.senderId === user?.user.id ? 'justify-end' : 'justify-start gap-2'}`}>
			{/* Hiển thị ảnh đại diện nếu là tin nhắn cuối của nhóm tin nhắn */}
			{message.senderId !== user?.user.id && isLastInGroup && conversationResponse?.avatarUrls && (
				<img
					src={isMatchingSender(message.senderId)?.avatarUrl}
					className="border border-sky-600 rounded-[100%] h-8 w-8 object-cover"
					alt="avatar"
				/>
			)}

			<div className={`flex flex-col max-w-[80%] gap-0.5
				${message.senderId === user?.user.id ? 'items-end justify-end' : 'items-start justify-start'}`}>

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

						{isFirstInGroup && message.senderId !== user?.user.id && conversationResponse?.group &&
							<div className={`absolute -top-5 left-1 text-xs w-max ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
								{isMatchingSender(message.senderId)?.firstName + `${isMatchingSender(message.senderId)?.lastName ? ' ' + isMatchingSender(message.senderId)?.lastName : ''}` }
							</div>
						}
					</div>
				)}

				{/* Show images/videos */}
				{message.publicIds != null && message.publicIds != "" && (
					<div className={`flex flex-col gap-[1px] max-w-[100%]
					${message.senderId === user?.user.id ? 'items-end justify-end' : 'items-start justify-start gap-2'}`}>
						{message.publicIds.map((publicId: string, index: number) => {
							const url = message.urls[index];
							const isVideo = isVideoUrl(url);
							const aspectRatio = message.widths[index] / message.heights[index];
							const widthPercentage = aspectRatio > 1.33 ? '80%' : `${aspectRatio < 0.75 ? '50%' : '60%'}`;

							return (
								<div key={publicId} className={`relative group w-[${widthPercentage}] max-w-[450px] min-w-[100px] cursor-pointer
          								${!isLastInGroup ? 'ms-10' : ''}`}>

									{isVideo ? (
										<video src={url} controls className="w-full h-auto rounded-xl"/>
									) : (
										<div>
											<img loading="lazy" src={url} alt="A message media" className="w-full h-auto rounded-xl"/>
											<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md"></div>
										</div>
									)}

								</div>
							);
						})}
					</div>
				)}

			</div>

			{isLastMessageByCurrentUser &&
				<div className={`absolute -bottom-6 right-1 text-xs w-max
					${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>Đã gửi</div>
			}
		</div>
	);

}

export default ChatMessage


