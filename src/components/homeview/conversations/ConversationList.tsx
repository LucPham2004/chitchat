import { conversations } from "../../../FakeData";


const ConversationList: React.FC = () => {


    return (
        <div className="w-full bg-white rounded-lg">
            <ul className="">
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
                        <div className="flex-1">
                            <h4 className="text-md font-semibold text-gray-800">{conv.name}</h4>
                            <p className="text-md text-gray-500 truncate">
                                {conv.lastMessage}
                                <span className="text-sm"> • {conv.time}</span>
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConversationList;