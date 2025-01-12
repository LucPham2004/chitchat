import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { useTheme } from '../../../utilities/ThemeContext';

const SearchBar: React.FC = () => {
	const [search, setSearch] = useState<string>('');
	const { isDarkMode, toggleDarkMode } = useTheme();

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Search query:', search);
	};

	return (
		<form
			onSubmit={handleSearch}
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
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Tìm kiếm trên ChitChat"
				className={`flex-grow ps-2 pe-4 py-1 focus:outline-none
					${isDarkMode ? 'bg-[#3A3B3C] border-gray-900 text-gray-100' 
						: 'bg-gray-100 border-gray-200 text-gray-700'}
				`}/>
		</form>
	);
};

export default SearchBar;
