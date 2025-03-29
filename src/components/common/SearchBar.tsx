import React, { useEffect, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { useTheme } from '../../utilities/ThemeContext';


interface SearchBarProps {
	placeholder?: string;
	onSearch: (keyword: string) => void;
	debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
	placeholder,
	onSearch,
	debounceTime = 200,
}) => {
	const { isDarkMode } = useTheme();
	const [keyword, setKeyword] = useState("");

	useEffect(() => {
		const handler = setTimeout(() => {
			onSearch(keyword);
		}, debounceTime);

		return () => clearTimeout(handler);
	}, [keyword, onSearch, debounceTime]);

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
		</form>
	);
};

export default SearchBar;
