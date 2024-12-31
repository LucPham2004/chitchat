import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const Friends = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-[96vh] max-h-[96vh] overflow-hidden w-full flex bg-white
            pb-0 rounded-xl border border-gray-200 shadow-sm overflow-y-auto">
            <div className="relative flex flex-col w-full min-h-full">
                <div className="absolute top-4 left-4 z-10">
                    <button className="p-2 rounded-full text-black text-xl bg-gray-200 hover:bg-gray-100"
                        onClick={goBack}>
                        <FaArrowLeft />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Friends;

