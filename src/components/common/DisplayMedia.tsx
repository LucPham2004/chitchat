import React from "react";
import { useTheme } from "../../utilities/ThemeContext";
import { IoClose } from "react-icons/io5";

interface DisplayMediaProps {
    url?: string;
	setIsDisplayMedia: (open: boolean) => void;
}

const DisplayMedia: React.FC<DisplayMediaProps> = ({url, setIsDisplayMedia}) => {
    const { isDarkMode } = useTheme();

    return (
        <div className="absolute w-screen h-screen flex flex-col items-center justify-center bg-[#050E15]/50 backdrop-blur-md z-50">
            <button className={`absolute top-2 left-6 text-3xl text-gray-700 font-semibold rounded-full p-1
                    ${isDarkMode ? 'text-white bg-[#474747] hover:bg-[#5A5A5A]'
                    : 'text-black bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setIsDisplayMedia(false)}>
                <IoClose />
            </button>
            <div className="h-[90vh]">
            {url ? (
                <img src={url} alt="Media" className="max-w-full w-auto h-full rounded-lg shadow-lg" />
            ) : (
                <p className="text-gray-500">Không có ảnh nào được chọn</p>
            )}
            </div>
        </div>
    );
};

export default DisplayMedia;
