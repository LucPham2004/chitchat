import { PiDotsThreeCircle } from "react-icons/pi"
import { useTheme } from "../../../../utilities/ThemeContext";
import { VscLayoutSidebarRight, VscLayoutSidebarRightOff } from "react-icons/vsc";

export interface ChatHeaderProps {
    toggleChangeWidth: () => void;
    toggleShowConversationMembersModalOpen?: () => void;
    isChangeWidth: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleChangeWidth, isChangeWidth, toggleShowConversationMembersModalOpen }) => {
    const { isDarkMode  } = useTheme();
    
    return (
        <div className={`flex justify-between items-center w-full p-0.5 border-b 
            ${isDarkMode ? 'border-gray-900' : 'border-gray-400'}`}>
            
            <div className={`relative flex-1 flex items-center rounded-lg p-1
                h-full min-w-0 max-w-fit  cursor-pointer gap-1
                ${isDarkMode ? 'hover:bg-[#353130]' : 'hover:bg-gray-100'}`}
                onClick={toggleShowConversationMembersModalOpen}>
                <div className={`p-1 rounded-lg cursor-pointer`}>
                    <img
                        className="w-10 h-10 rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/proxy/tm1RJoA6rodhWBKMGRfzeR74pIbdxub44suRwIU0sEoJmhWqKL6fdcu2dam9sX15_HKYaodIjV_63KdvKVR9OIxN6tq9hL2NsGJMDSjwdOowrZrKnJWaCT2AC3HI6KjJyAkf0S9y6wBzJVzblA"
                        alt={`ksadnjsd's avatar`}
                    />
                    <img className="w-4 h-4 absolute top-8 left-8" src="/onlineIcon.png" alt="online icon" />
                </div>
                <div className='flex flex-col justify-center items-left'>
                    <h3 className={`${isDarkMode ? 'text-gray-100' : 'text-gray-800'} font-semibold`}>Cristiano Ronaldo</h3>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Đang hoạt động</p>
                </div>
            </div>

            <div className="flex me-2">
                <button className={`self-end rounded-full p-2 text-center text-2xl font-semibold
                    ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-700 hover:bg-gray-200'}`}
                    onClick={toggleChangeWidth}>
                    {isChangeWidth ? <VscLayoutSidebarRightOff /> : <VscLayoutSidebarRight />}
                </button>
            </div>

        </div>
    )
}

export default ChatHeader

