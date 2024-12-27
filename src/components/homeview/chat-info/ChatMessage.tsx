

interface MessageProps {
	message: {
		text: string;
		user: string;
	};
	name: string;
}

const ChatMessage :React.FC<MessageProps> = ({ message: { text, user }, name }) => {
    return (
        <div className={`chat-message ${user === user ? 'chat-message-sent' : 'chat-message-received'}`}>
            <div className="chat-message-user">
                <img src={user} alt="User" />
            </div>
            <div className="chat-message-content">
                <p>{text}</p>
            </div>
        </div>
    )
}

export default ChatMessage


