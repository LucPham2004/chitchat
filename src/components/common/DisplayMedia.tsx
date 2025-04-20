import React from "react";
import { useTheme } from "../../utilities/ThemeContext";
import { IoClose } from "react-icons/io5";

interface DisplayMediaProps {
    url?: string;
    setIsDisplayMedia: (open: boolean) => void;
}

const DisplayMedia: React.FC<DisplayMediaProps> = ({ url, setIsDisplayMedia }) => {
    const { isDarkMode } = useTheme();

    const isVideoUrl = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
        return videoExtensions.some(ext => url.toLowerCase().includes(ext));
    };

    return (
        <div className="absolute w-screen h-screen flex flex-col items-center justify-center bg-[#050E15]/50 backdrop-blur-md z-50"
            onClick={() => setIsDisplayMedia(false)}>
            <button className={`absolute top-2 left-6 text-3xl text-gray-700 font-semibold rounded-full p-1
                    ${isDarkMode ? 'text-white bg-[#474747] hover:bg-[#5A5A5A]'
                    : 'text-black bg-gray-100 hover:bg-gray-200'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsDisplayMedia(false);
                    }}>
                <IoClose />
            </button>
            <div className="max-w-[90vw] h-[90vh]" onClick={(e) => e.stopPropagation()}>
                {url && isVideoUrl(url) ? (
                    <video src={url} controls className="max-w-full w-auto h-full rounded-lg"/>
                )
                : (
                    <img
                        src={url}
                        alt={`Media`}
                        className="max-w-full w-auto h-full rounded-lg"
                    />
                )}
            </div>
        </div>
    );
};

export default DisplayMedia;
