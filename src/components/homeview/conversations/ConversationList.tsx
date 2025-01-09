import { conversations } from "../../../FakeData";


const ConversationList: React.FC = () => {


    return (
        <div className="w-full bg-white rounded-lg">
            <ul className="w-full">
                {conversations.map((conv) => (
                    <li
                        key={conv.id}
                        className="flex items-center self-start p-2.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <img
                            src={conv.avatarUrl}
                            alt={conv.name}
                            className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div className="flex-1 max-w-[90%]">
                            <h4 className="text-md font-semibold text-gray-800">{conv.name}</h4>
                            <div className="w-full flex items-center">
                                <p className="text-sm text-gray-500 truncate max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap">
                                    {conv.lastMessage}
                                </p>
                                <span className="text-sm text-gray-500 "> • {conv.time}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConversationList;