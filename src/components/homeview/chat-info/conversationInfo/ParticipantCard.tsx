import { PiDotsThreeBold } from "react-icons/pi";

export interface Participant {
    id: string;
    avatar: string;
    name: string;
}

const ParticipantCard: React.FC<Participant> = ({ id, avatar, name }) => {
    return (
        <div className="flex flex-row justify-between p-2">
            <div className="flex items-center gap-2">
                <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover"/>
                <div className="font-semibold">
                    <h3>{name}</h3>
                </div>
            </div>

            <button className="self-end rounded-full hover:bg-gray-200 p-1 text-center text-3xl font-semibold">
                <PiDotsThreeBold />
            </button>
        </div>
    );
}

export default ParticipantCard;

