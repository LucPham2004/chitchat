import { useState } from "react";
import { conversations } from "../../../FakeData";
import { useTheme } from "../../../utilities/ThemeContext";


const ConversationList: React.FC = () => {
    const { isDarkMode  } = useTheme();


    return (
        <div className={`w-full rounded-lg 
            ${isDarkMode ? 'bg-[#1F1F1F] text-gray-100 border-gray-900' : 'bg-white text-black border-gray-200'}`}>
            <ul className="w-full">
                {conversations.map((conv) => (
                    <li
                        key={conv.id}
                        className={`flex items-center self-start p-2.5 rounded-lg cursor-pointer
                            ${isDarkMode ? 'text-white hover:bg-[#3A3A3A]' : 'text-black hover:bg-gray-100'}`}
                    >
                        <img
                            src={conv.avatarUrl}
                            alt={conv.name}
                            className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div className="flex-1 max-w-[90%]">
                            <h4 className={`text-md font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{conv.name}</h4>
                            <div className="w-full flex items-center">
                                <p className={`text-sm truncate max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap
                                    ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {conv.lastMessage}
                                </p>
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}> • {conv.time}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConversationList;