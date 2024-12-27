import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";

const SearchBar: React.FC = () => {
	const [search, setSearch] = useState<string>('');

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Search query:', search);
	};

	return (
		<form
			onSubmit={handleSearch}
			className="flex items-center bg-gray-100 border border-gray-200 rounded-full overflow-hidden w-full max-w-lg mx-auto"
		>
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
				className="flex-grow ps-2 pe-4 py-1 bg-gray-100 text-gray-700 focus:outline-none"
			/>
		</form>
	);
};

export default SearchBar;
