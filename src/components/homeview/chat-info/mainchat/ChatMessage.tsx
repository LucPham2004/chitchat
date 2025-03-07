import { useTheme } from "../../../../utilities/ThemeContext";


interface MessageProps {
	message: {
		senderId: number;
		avatarUrl: string;
		text: string;
		name: string;
	};
	isFirstInGroup: boolean;
	isLastInGroup: boolean;
	isSingleMessage: boolean;
	isLastMessageByCurrentUser?: boolean;
}

const ChatMessage: React.FC<MessageProps> = ({
	message: { senderId, text, name, avatarUrl },
	isFirstInGroup, isLastInGroup, isSingleMessage, isLastMessageByCurrentUser }) => {

	const { isDarkMode  } = useTheme();
	const currentUser = {
		id: 5,

	};

	return (
		<div
			className={`flex items-end ${senderId === currentUser.id ? 'justify-end' : 'justify-start gap-2'
				}`}
		>
			{/* Hiển thị ảnh đại diện nếu là tin nhắn cuối của nhóm tin nhắn */}
			{senderId !== currentUser.id && isLastInGroup && (
				<img
					src={avatarUrl}
					className="border border-sky-600 rounded-[100%] h-8 w-8 object-cover"
					alt="avatar"
				/>
			)}

			
			<div
				className={`relative inline-flex max-w-[80%] pt-1 pb-1.5 px-3 ${senderId === currentUser.id
						? 'bg-[#0199FC] text-white'
						: `${isDarkMode ? 'bg-[#4C4C4C] text-gray-300' : 'bg-[#F3F3F3]'} text-[#353535]`
					} ${isSingleMessage // Nếu là tin nhắn đơn
						? senderId === currentUser.id ? 'rounded-[20px]' : 'rounded-[20px] mt-6'
						: isFirstInGroup // Nếu là tin nhắn đầu trong chuỗi tin nhắn
							? senderId === currentUser.id
								? 'rounded-t-[20px] rounded-bl-[20px] rounded-br-[4px]' // Người dùng hiện tại
								: 'rounded-t-[20px] rounded-br-[20px] rounded-bl-[4px] ms-10' // Người gửi khác
							: isLastInGroup // Nếu là tin nhắn cuối trong chuỗi tin nhắn
								? senderId === currentUser.id
									? 'rounded-b-[20px] rounded-tl-[20px] rounded-tr-[4px]' // Người dùng hiện tại
									: 'rounded-b-[20px] rounded-tr-[20px] rounded-tl-[4px]' // Người gửi khác
								: senderId === currentUser.id // Nếu là tin nhắn giữa trong chuỗi tin nhắn
									? 'rounded-l-[20px] rounded-r-[4px]' // Người dùng hiện tại
									: 'rounded-r-[20px] rounded-l-[4px] ms-10' // Người gửi khác
					}`}
			>
				<p className="text-[15px] break-words inline-flex">{text}</p>
				{ isFirstInGroup && senderId !== currentUser.id &&
					<div className={`absolute -top-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{name}</div>
				}
				{ isLastMessageByCurrentUser &&
					<div className={`absolute -bottom-6 right-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'} text-xs`}>Đã gửi</div>
				}
			</div>
		</div>
	);

}

export default ChatMessage


