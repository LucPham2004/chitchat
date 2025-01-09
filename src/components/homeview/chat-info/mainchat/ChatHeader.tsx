import { PiDotsThreeCircle } from "react-icons/pi"

export interface ChatHeaderProps {
    toggleChangeWidth: () => void;
    toggleShowConversationMembersModalOpen?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleChangeWidth, toggleShowConversationMembersModalOpen }) => {
    return (
        <div className="flex justify-between items-center w-full p-0.5 border-b border-gray-200">
            
            <div className="relative flex-1 flex items-center rounded-lg p-1
                h-full min-w-0 max-w-fit hover:bg-gray-100 cursor-pointer gap-1"
                onClick={toggleShowConversationMembersModalOpen}>
                <div className="p-1 rounded-lg hover:bg-gray-200 cursor-pointer">
                    <img
                        className="w-10 h-10 rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/proxy/tm1RJoA6rodhWBKMGRfzeR74pIbdxub44suRwIU0sEoJmhWqKL6fdcu2dam9sX15_HKYaodIjV_63KdvKVR9OIxN6tq9hL2NsGJMDSjwdOowrZrKnJWaCT2AC3HI6KjJyAkf0S9y6wBzJVzblA"
                        alt={`ksadnjsd's avatar`}
                    />
                    <img className="w-4 h-4 absolute top-8 left-8" src="/onlineIcon.png" alt="online icon" />
                </div>
                <div className='flex flex-col justify-center items-left'>
                    <h3 className='text-gray-800 font-semibold'>Cristiano Ronaldo</h3>
                    <p className='text-gray-500 text-xs'>Đang hoạt động</p>
                </div>
            </div>

            <div className="flex me-2">
                <button className="self-end rounded-full hover:bg-gray-200 p-2 text-center text-2xl font-semibold"
                    onClick={toggleChangeWidth}>
                    <PiDotsThreeCircle />
                </button>
            </div>

        </div>
    )
}

export default ChatHeader

