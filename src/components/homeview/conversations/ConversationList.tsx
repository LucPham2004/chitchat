import { conversations } from "../../../FakeData";


const ConversationList: React.FC = () => {


    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg">
            <ul className="">
                {conversations.map((conv) => (
                    <li
                        key={conv.id}
                        className="flex items-center p-2.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <img
                            src={conv.avatar}
                            alt={conv.name}
                            className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div className="flex-1">
                            <h4 className="text-md font-semibold text-gray-800">{conv.name}</h4>
                            <p className="text-md text-gray-500 truncate">{conv.lastMessage}</p>
                        </div>
                        <div className="text-xs text-gray-400">{conv.time}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConversationList;