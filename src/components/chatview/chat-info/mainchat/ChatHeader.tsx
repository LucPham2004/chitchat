import { useTheme } from "../../../../utilities/ThemeContext";
import { VscLayoutSidebarRight, VscLayoutSidebarRightOff } from "react-icons/vsc";
import { MainChatProps } from "./MainChat";
import ConversationAvatar from "../../conversations/ConversationAvatar";
import { IoCall, IoVideocam } from "react-icons/io5";
import { useAuth } from "../../../../utilities/AuthContext";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import useDeviceTypeByWidth from "../../../../utilities/useDeviceTypeByWidth";
import { ROUTES } from "../../../../utilities/Constants";


const ChatHeader: React.FC<MainChatProps> = ({
    toggleChangeWidth, isChangeWidth,
    toggleShowConversationMembersModalOpen,
    conversationResponse
}) => {

    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const deviceType = useDeviceTypeByWidth();

    const handleCallAudio = () => {
        const callUrl = `${window.location.origin}/call?t=audio&r=${conversationResponse?.participantIds.filter(id => id != user?.user.id)}`;
        deviceType !== 'Mobile' 
        ? window.open(callUrl, "_blank", "width=900,height=600")
        : window.location.href = `${callUrl}`;
    };

    const handleCallVideo = () => {
        const callUrl = `${window.location.origin}/call?t=video&r=${conversationResponse?.participantIds.filter(id => id != user?.user.id)}`;
        deviceType !== 'Mobile' 
        ? window.open(callUrl, "_blank", "width=900,height=600")
        : window.location.href = `${callUrl}`;
    };

    return (
        <div className={`flex justify-between items-center w-full p-0.5 ps-1 pb-1 border-b h-[9dvh]
            ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>

            <div className="flex justify-between items-center ms-2 gap-1">
            {deviceType == 'Mobile' && (
                <Link to={`${ROUTES.MOBILE.CONVERSATIONS}`}>
                    <button className={`p-2 rounded-full text-xl
                                        ${isDarkMode ? 'text-gray-200 bg-[#474747] hover:bg-[#5A5A5A]'
                            : 'text-black bg-gray-200 hover:bg-gray-100'}`}>
                        <FaArrowLeft />
                    </button>
                </Link>
            )}

            <div className={`relative flex-1 flex items-center rounded-lg p-1
                h-full min-w-0 max-w-fit  cursor-pointer gap-1
                ${isDarkMode ? 'hover:bg-[#35313055]' : 'hover:bg-[#ffffff55]'}`}
                onClick={() => {
                    if (conversationResponse?.group) {
                        toggleShowConversationMembersModalOpen;
                    } else {
                        window.location.href = `${deviceType == 'Mobile' 
                            ? `/mobile/profile/${conversationResponse?.participantIds.filter(id => id != user?.user.id)}`
                            : `/d/profile/${conversationResponse?.participantIds.filter(id => id != user?.user.id)}`}`;
                    }

                }}>
                <div className={`p-1 rounded-lg cursor-pointer`}>
                    <ConversationAvatar avatarUrls={conversationResponse?.avatarUrls != undefined ? conversationResponse?.avatarUrls : []}
                        width={10} height={10}></ConversationAvatar>
                    <img className="w-4 h-4 absolute top-8 left-8" src="/onlineIcon.png" alt="online icon" />
                </div>
                <div className='flex flex-col justify-center items-left'>
                    <h3 className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-semibold`}>{conversationResponse?.name}</h3>
                    {/* <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Đang hoạt động</p> */}
                </div>
            </div>

            </div>

            <div className="flex me-4 gap-2">
                <button className={`self-end rounded-full p-2 text-center text-xl font-semibold
                    ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-700 hover:bg-gray-200'}`}
                    onClick={handleCallAudio}>
                    <IoCall />
                </button>
                <button className={`self-end rounded-full p-2 text-center text-xl font-semibold
                    ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-700 hover:bg-gray-200'}`}
                    onClick={handleCallVideo}>
                    <IoVideocam />
                </button>
                <button className={`self-end rounded-full p-2 text-center text-xl font-semibold
                    ${isDarkMode ? 'text-gray-300 hover:bg-[#5A5A5A]' : 'text-gray-700 hover:bg-gray-200'}`}
                    onClick={toggleChangeWidth}>
                    {isChangeWidth ? <VscLayoutSidebarRightOff /> : <VscLayoutSidebarRight />}
                </button>
            </div>

        </div>
    )
}

export default ChatHeader

