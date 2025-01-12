import { useTheme } from "../../../../utilities/ThemeContext";


interface MessageProps {
	message: {
		text: string;
		user: string;
	};
	name: string;
}

const ChatMessage :React.FC<MessageProps> = ({ message: { text, user }, name }) => {
	const { isDarkMode, toggleDarkMode } = useTheme();
    let isSentByCurrentUser = false;

	const trimmedName = name.trim().toLowerCase();

	if (user === trimmedName) {
		isSentByCurrentUser = true;
	}

	return (
		isSentByCurrentUser ? (
			<div className="flex justify-end items-end my-1">
				<div className="inline-block max-w-[80%] bg-[#0199FC] rounded-[20px] p-2 px-3">
					<p className="text-white text-base break-words">{text}</p>
				</div>
			</div>
		) : (
			<div className="flex justify-start items-end my-1 gap-2">
				<img src="https://lh3.googleusercontent.com/proxy/tm1RJoA6rodhWBKMGRfzeR74pIbdxub44suRwIU0sEoJmhWqKL6fdcu2dam9sX15_HKYaodIjV_63KdvKVR9OIxN6tq9hL2NsGJMDSjwdOowrZrKnJWaCT2AC3HI6KjJyAkf0S9y6wBzJVzblA"
					className="border border-sky-600 rounded-[100%] h-8 w-8 object-cover"
					alt="error"
				/>
				<div className="inline-block max-w-[80%] bg-[#F3F3F3] rounded-[20px] p-2 px-3">
					<p className="text-[#353535] text-base break-words">{text}</p>
				</div>
			</div>
		)
	);
}

export default ChatMessage


