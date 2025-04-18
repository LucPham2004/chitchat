import { FaArrowLeft, FaLink, FaUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { act, useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { BsFillBellFill } from "react-icons/bs";
import MediaGrid from "./MediaGrid";
import { linkUrls } from "../../../../FakeData";
import useDeviceTypeByWidth from "../../../../utilities/useDeviceTypeByWidth";
import { useTheme } from "../../../../utilities/ThemeContext";
import { ConversationResponse } from "../../../../types/Conversation";
import Accordion from "./Accordion";
import ConversationAvatar from "../../conversations/ConversationAvatar";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../../utilities/AuthContext";
import { getMediasByConversationId, getRawFilesByConversationId } from "../../../../services/MediaService";
import { MediaResponse } from "../../../../types/Media";
import { ChatParticipants } from "../../../../types/User";
import { searchMessages } from "../../../../services/MessageService";
import { ChatResponse } from "../../../../types/Message";
import Avatar from "../../../common/Avatar";
import SearchBar from "../../../common/SearchBar";


export interface ConversationInfoProps {
    togglePinnedMessageModalOpen: () => void;
    toggleChangeConversationNameModalOpen: () => void;
    toggleChangeConversationEmojiModalOpen: () => void;
    toggleChangeWidth: () => void;
    conversationResponse?: ConversationResponse;
    participants?: ChatParticipants[];
}

const ConversationInfo: React.FC<ConversationInfoProps> = ({
    togglePinnedMessageModalOpen,
    toggleChangeConversationNameModalOpen,
    toggleChangeConversationEmojiModalOpen,
    toggleChangeWidth,
    conversationResponse,
    participants
}) => {

    const { user } = useAuth();
    const { conv_id } = useParams();
    const deviceType = useDeviceTypeByWidth();
    const { isDarkMode } = useTheme();

    const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);

    const [mediaList, setMediaList] = useState<MediaResponse[]>([]);
    const [rawFileList, setRawFileList] = useState<MediaResponse[]>([]);
    const [searchedMessages, setSearchedMessages] = useState<ChatResponse[] | null>(null);

    const [activeTab, setActiveTab] = useState('default'); // Tab mặc định
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationDirection, setAnimationDirection] = useState('');

    const [loading, setLoading] = useState<boolean>(false);

    const toggleUserMenu = (participantId: number) => {
        setSelectedParticipantId(prev => (prev === participantId ? null : participantId));
    };

    const handleMessageSearch = async (keyword: string) => {
        if (conv_id) {
            if (keyword.trim() === "") {
                setSearchedMessages(null);
                return;
            }
            try {
                setLoading(true);
                const data = await searchMessages(parseInt(conv_id), keyword, 0);
                if (data?.result?.content) {
                    setSearchedMessages(data.result?.content);
                    setLoading(false);
                    console.log("Messages found:", data.result);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error searching conversations:", error);
                setLoading(false);
            }
        }
    };
    
    const handleClearSearch = () => {
        setSearchedMessages(null);
    };

    const isMatchingSender = (senderId: number) => {
		return participants?.find(participant => participant.id === senderId);
	}

    const handleTabChange = (tab: any) => {
        if (tab !== activeTab) {
            setAnimationDirection(tab !== 'default' ? 'left' : 'right');
            setIsAnimating(true);

            setTimeout(() => {
                setActiveTab(tab);
                setIsAnimating(false);
            }, 100);
        }

        console.log(conversationResponse);
    };

    const linkList: string[] = [];

    const fetchMediasFilesLinks = async () => {
        try {
            if (conv_id) {
                setLoading(true);
                let response;

                switch (activeTab) {
                    case 'media':
                        response = await getMediasByConversationId(parseInt(conv_id), 0);
                        if (response.result) {
                            setMediaList(response.result.content);
                        }
                        break;
                    case 'files':
                        response = await getRawFilesByConversationId(parseInt(conv_id), 0);
                        if (response.result) {
                            setRawFileList(response.result.content);
                        }
                        break;
                    case 'links':

                        break;
                    default:
                }
                setLoading(false);
            }
        } catch (error) {
            console.log('Lỗi khi lấy danh sách media:', error);
        }
    }

    useEffect(() => {
        fetchMediasFilesLinks();
    }, [activeTab, conv_id]);

    // Nội dung từng tab
    const renderTabContent = () => {
        switch (activeTab) {

            case 'search':
                return (
                    <>
                    {searchedMessages !== null && searchedMessages.length > 0 ? (
                        <ul className="w-full">
                            {searchedMessages.map((message) => (
                                <Link to={``} key={message.id} onClick={handleClearSearch}>
                                    <li className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
                                            ${isDarkMode ? 'hover:bg-[#3A3A3A]' : 'hover:bg-gray-100'}`}>
                                        <Avatar avatarUrl={isMatchingSender(message.senderId)?.avatarUrl} width={12} height={12}></Avatar>
                                        <div className="flex-1 max-w-[80%]">
                                            <span className={`text-md font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                                {isMatchingSender(message.senderId)?.firstName + `${isMatchingSender(message.senderId)?.lastName ? ' ' + isMatchingSender(message.senderId)?.lastName : ''}`}
                                            </span>
                                            <p className={`text-[13px] truncate overflow-hidden text-ellipsis whitespace-nowrap
                                                ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                                {message.content}
                                            </p>
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                        ) : (
                            <p className="text-gray-500 text-center">Không tìm thấy tin nhắn nào.</p>
                        )
                    }
                    </>
                );

            case 'media':
                return (
                    mediaList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center w-60 h-60">
                            <p className={`text-md font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                Không có file phương tiện nào</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                Ảnh và video các bạn trao đổi với nhau sẽ hiện ở đây</p>
                        </div>
                    ) :
                        <MediaGrid medias={mediaList} />
                );
            case 'files':
                return (
                    rawFileList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center w-60 h-60">
                            <p className={`text-md font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                Không có file nào</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                File các bạn trao đổi với nhau sẽ hiện ở đây</p>
                        </div>
                    ) :
                        <div className="flex flex-col items-start max-h-[74vh] w-full overflow-y-auto rounded-lg">
                            {rawFileList.map((file, index) => (
                                <a key={index} className="w-full" 
                                    href={file.url.replace("/upload/", "/upload/fl_attachment/")}
                                    download={file.fileName}
                                    target="blank" >
                                    <div className={`flex items-center gap-2 pt-2 mb-2 text-md font-medium w-full
                                        ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                        <div className={`px-2 gap-2 h-12 flex items-center justify-center rounded-lg w-full
                                            ${isDarkMode ? 'bg-[#474747]' : 'bg-gray-200'}`}>
                                            <FaFileAlt className="text-lg"/>
                                            <p className="text-md w-full">{file.fileName}</p>
                                        </div>
                                    </div>
                                    <hr></hr>
                                </a>
                            ))}
                        </div>
                );
            case 'links':
                return (
                    linkList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center w-60 h-60">
                            <p className={`text-md font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                Không có liên kết nào</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                                Liên kết các bạn trao đổi với nhóm này sẽ hiện ở đây</p>
                        </div>
                    ) :
                        <div className="flex flex-col max-h-[74vh] overflow-y-auto rounded-lg">
                            {linkList.map((link, index) => (
                                <div key={index}>
                                    <div className={`flex items-center gap-2 pt-2 mb-2 text-md font-medium 
                                        ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                        <div className={`text-lg px-2 h-12 flex items-center justify-center rounded-lg
                                            ${isDarkMode ? 'bg-[#474747]' : 'bg-gray-200'}`}>
                                            <FaLink />
                                        </div>
                                        <a href={link} target="blank" className="ps-0.5">{link}</a>
                                    </div>
                                    <hr></hr>
                                </div>
                            ))}
                        </div>
                );
            default:
                return (
                    <div className={`relative flex flex-col gap-2 min-w-full min-h-[96vh] max-h-[96vh] overflow-y-auto 
                        p-1 pb-0 rounded-xl border shadow-sm transition-transform duration-300 
                        ${isAnimating ? (animationDirection === 'right' ? 'translate-x-full' : '-translate-x-full') : ''}
                        ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>

                        {deviceType !== 'PC' &&
                            <button className={`absolute w-fit p-2 top-4 left-4 text-left text-xl font-medium rounded-full 
                                ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]'
                                    : 'text-gray-800 hover:bg-gray-100'}`}
                                onClick={() => toggleChangeWidth()}>
                                <FaArrowLeft />
                            </button>
                        }

                        <div className="flex flex-col items-center gap-1 p-2">
                            <ConversationAvatar avatarUrls={conversationResponse?.avatarUrls != undefined ? conversationResponse?.avatarUrls : []}
                                width={24} height={24}></ConversationAvatar>
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>{conversationResponse?.name}</h3>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>Đang hoạt động</p>
                        </div>

                        <div className={`flex flex-row justify-center gap-4 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>

                            {!conversationResponse?.group && (
                                <div className="flex flex-col items-center w-[70px] text-center">
                                    <Link to={`/profile/${conversationResponse?.participantIds.find(id => id !== user?.user.id)}`}>
                                        <button className={`p-2 text-xl rounded-full
                                            ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]'
                                                : 'text-black bg-gray-100 hover:bg-gray-200'}`}>
                                            <FaUserCircle />
                                        </button>
                                        <p className="text-sm">Trang cá nhân</p>
                                    </Link>
                                </div>
                            )}

                            <div className="flex flex-col items-center w-[70px] text-center">
                                <button className={`p-2 text-xl rounded-full
                                    ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]'
                                        : 'text-black bg-gray-100 hover:bg-gray-200'}`}>
                                    <BsFillBellFill />
                                </button>
                                <p className="text-sm">Tắt thông báo</p>
                            </div>

                            <div className="flex flex-col items-center w-[70px] text-center">
                                <button className={`p-2 text-xl rounded-full
                                    ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]'
                                        : 'text-black bg-gray-100 hover:bg-gray-200'}`}
                                        onClick={() => setActiveTab('search')}>
                                    <IoSearch />
                                </button>
                                <p className="text-sm">Tìm kiếm</p>
                            </div>
                        </div>

                        <div className="flex flex-col p-2">
                            <Accordion
                                toggleChangeConversationEmojiModalOpen={toggleChangeConversationEmojiModalOpen}
                                toggleChangeConversationNameModalOpen={toggleChangeConversationNameModalOpen}
                                togglePinnedMessageModalOpen={togglePinnedMessageModalOpen}
                                handleTabChange={handleTabChange}
                                selectedParticipantId={selectedParticipantId}
                                toggleUserMenu={toggleUserMenu}
                                isGroup={conversationResponse?.group}
                                emoji={conversationResponse?.emoji}
                                participants={participants}
                            ></Accordion>

                        </div>
                    </div>
                );
        }
    };

    return (
        activeTab !== 'default' && activeTab != 'search' ? (
            <div className={`flex flex-col gap-4 min-w-full min-h-[96vh] max-h-[96vh] overflow-y-auto 
                pt-1 px-3 rounded-xl border shadow-sm transition-transform duration-300 
                ${isAnimating ? (animationDirection === 'right' ? 'translate-x-full' : '-translate-x-full') : ''}
                ${isDarkMode ? 'text-gray-300 bg-[#1F1F1F] border-gray-800' : 'text-black bg-white border-gray-200'}`}
            >
                <div className="flex items-center gap-2 p-2">
                    <button className={`flex items-center gap-2 p-2 text-left text-lg font-medium 
                        rounded-full 
                        ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]'
                            : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={() => handleTabChange('default')}>
                        <FaArrowLeft />
                    </button>
                    <p className="text-lg font-semibold">File phương tiện, file và liên kết</p>
                </div>

                <div className={`flex justify-between border rounded-full 
                    ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <button
                        className={`rounded-full p-2 text-center font-semibold 
                            ${activeTab === 'media' ? isDarkMode ? 'text-gray-300 bg-[#474747]'
                                : 'text-black bg-gray-200' : isDarkMode ? 'text-gray-400'
                                : 'text-gray-500'}`}
                        onClick={() => setActiveTab('media')}
                    >
                        File phương tiện
                    </button>
                    <button
                        className={`rounded-full p-2 flex-1 text-center font-semibold 
                            ${activeTab === 'files' ? isDarkMode ? 'text-gray-300 bg-[#474747]'
                                : 'text-black bg-gray-200' : isDarkMode ? 'text-gray-400'
                                : 'text-gray-500'}`}
                        onClick={() => setActiveTab('files')}
                    >
                        File
                    </button>
                    <button
                        className={`rounded-full p-2 flex-1 text-center font-semibold 
                            ${activeTab === 'links' ? isDarkMode ? 'text-gray-300 bg-[#474747]'
                                : 'text-black bg-gray-200' : isDarkMode ? 'text-gray-400'
                                : 'text-gray-500'}`}
                        onClick={() => setActiveTab('links')}
                    >
                        Liên kết
                    </button>
                </div>

                <div className="p-2 pe-0 flex justify-center">

                    {loading ? (
                        <div className={`max-h-[96vh] overflow-hidden w-full flex items-center justify-center
                            pb-0 rounded-xl border shadow-sm overflow-y-auto
                            ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
                        </div>
                    )
                        : (
                            renderTabContent()
                        )}
                </div>
            </div>
        ) : (
            activeTab == 'search' ? 
            <div className={`flex flex-col gap-4 min-w-full min-h-[96vh] max-h-[96vh] overflow-y-auto 
                pt-1 px-3 rounded-xl border shadow-sm transition-transform duration-300 
                ${isAnimating ? (animationDirection === 'right' ? 'translate-x-full' : '-translate-x-full') : ''}
                ${isDarkMode ? 'text-gray-300 bg-[#1F1F1F] border-gray-800' : 'text-black bg-white border-gray-200'}`}
            >
                <div className="flex items-center gap-2 p-2">
                    <button className={`flex items-center gap-2 p-2 text-left text-lg font-medium 
                        rounded-full 
                        ${isDarkMode ? 'text-gray-300 bg-[#474747] hover:bg-[#5A5A5A]'
                            : 'text-gray-800 hover:bg-gray-100'}`}
                        onClick={() => handleTabChange('default')}>
                        <FaArrowLeft />
                    </button>
                    <p className="text-lg font-semibold">Tìm kiếm</p>
                </div>
                
                <SearchBar placeholder="Tìm kiếm tin nhắn..." onSearch={handleMessageSearch} onClear={handleClearSearch}/>

                <div className="flex justify-center">

                    {loading ? (
                        <div className={`max-h-[96vh] overflow-hidden w-full flex items-center justify-center
                            pb-0 rounded-xl border shadow-sm overflow-y-auto
                            ${isDarkMode ? 'bg-[#1F1F1F] border-gray-900' : 'bg-white border-gray-200'}`}>
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
                        </div>
                    )
                        : (
                            renderTabContent()
                        )}
                </div>
            </div> 
            :
            <div className={`min-w-full overflow-hidden rounded-xl
                ${isAnimating ? (animationDirection === 'right' ? 'translate-x-full' : '') : ''}
                ${isDarkMode ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
                {renderTabContent()}
            </div>
        )
    );
}

export default ConversationInfo;


