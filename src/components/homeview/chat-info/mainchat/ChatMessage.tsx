import { ConversationResponse } from "../../../../types/Conversation";
import { ChatResponse } from "../../../../types/Message";
import { useAuth } from "../../../../utilities/AuthContext";
import { useTheme } from "../../../../utilities/ThemeContext";


interface MessageProps {
	message: ChatResponse;
	isFirstInGroup: boolean;
	isLastInGroup: boolean;
	isSingleMessage: boolean;
	isLastMessageByCurrentUser?: boolean;
	conversationResponse: ConversationResponse;
}

const ChatMessage: React.FC<MessageProps> = ({
	message, isFirstInGroup, isLastInGroup, isSingleMessage, isLastMessageByCurrentUser, conversationResponse }) => {

	const { user } = useAuth();
	const { isDarkMode  } = useTheme();

	return (
		<div
			className={`flex items-end ${message.senderId === user?.user.id ? 'justify-end' : 'justify-start gap-2'
				}`}
		>
			{/* Hiển thị ảnh đại diện nếu là tin nhắn cuối của nhóm tin nhắn */}
			{message.senderId !== user?.user.id && isLastInGroup && (
				<img
					src={conversationResponse.avatarUrl}
					className="border border-sky-600 rounded-[100%] h-8 w-8 object-cover"
					alt="avatar"
				/>
			)}

			
			<div
				className={`relative inline-flex max-w-[80%] pt-1 pb-1.5 px-3 ${message.senderId === user?.user.id
						? 'bg-[#0199FC] text-white'
						: `${isDarkMode ? 'bg-[#4C4C4C] text-gray-300' : 'bg-[#F3F3F3]'} text-[#353535]`
					} ${isSingleMessage // Nếu là tin nhắn đơn
						? message.senderId === user?.user.id ? 'rounded-[20px]' : 'rounded-[20px] mt-6'
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
					}`}
			>
				<p className="text-[15px] break-words inline-flex">{message.content}</p>
				{ isFirstInGroup && message.senderId !== user?.user.id &&
					<div className={`absolute -top-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}></div>
				}
				{ isLastMessageByCurrentUser &&
					<div className={`absolute -bottom-6 right-1 text-xs w-max
						${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>Đã gửi</div>
				}
			</div>
		</div>
	);

}

export default ChatMessage


