import React, { useEffect, useState } from 'react';
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { useTheme } from '../../utilities/ThemeContext';


interface SearchBarProps {
    placeholder?: string;
    onSearch: (keyword: string) => void;
    onClear?: () => void;  // Thêm prop onClear
    debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder,
    onSearch,
    onClear,  // Nhận prop onClear
    debounceTime = 200,
}) => {
    const { isDarkMode } = useTheme();
    const [keyword, setKeyword] = useState("");

    const handleClearInput = () => {
        setKeyword("");
        onSearch("");
        if (onClear) onClear();
    };

	useEffect(() => {
		const handler = setTimeout(() => {
			onSearch(keyword);
		}, debounceTime);

		return () => clearTimeout(handler);
	}, [keyword]);

	return (
		<form
			className={`flex items-center border rounded-full overflow-hidden w-full max-w-lg mx-auto
				${isDarkMode ? 'bg-[#3A3B3C] border-gray-900' : 'bg-gray-100 border-gray-200'}`}>
			<button
				type="submit"
				className="ps-3 py-1 rounded-full text-2xl"
			>
				<IoIosSearch />
			</button>
			<input
				type="text"
				value={keyword}
				onChange={(e) => setKeyword(e.target.value)}
				placeholder={placeholder}
				className={`flex-grow ps-2 pe-4 py-1 focus:outline-none
					${isDarkMode ? 'bg-[#3A3B3C] border-gray-900 text-gray-100'
						: 'bg-gray-100 border-gray-200 text-gray-700'}
				`} />
			{keyword.length > 0 && (
				<button
					type="button"
					className="ps-3 py-1 rounded-full text-xl me-2"
					onClick={handleClearInput}
				>
					<IoMdClose /> 
				</button>
			)}
		</form>
	);
};

export default SearchBar;
