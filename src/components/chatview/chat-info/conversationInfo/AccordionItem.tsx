import { ReactNode, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useTheme } from "../../../../utilities/ThemeContext";

interface AccordionItemProps {
	title: string;
	content: ReactNode;
	toggleAccordion: (index: number) => void;
	index: number;
	openIndices: number[];
	hidden?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, toggleAccordion, index, openIndices, hidden
 }) => {
	const { isDarkMode  } = useTheme();

	if (hidden) return null;

	return (
		<div className="">
			{/* <button
				onClick={() => {
					toggleAccordion(index);
				} }
				className={`flex justify-between w-full p-2 py-3 text-left text-md font-medium rounded-lg 
					${isDarkMode ? 'text-gray-200 hover:bg-[#5A5A5A]'
					: 'text-gray-800 hover:bg-gray-100'}`}
			>
				{title}
				<span
					className={`transform transition-transform duration-300 
						${openIndices.includes(index) ? 'rotate-180' : 'rotate-0'}`}>
					<IoIosArrowDown />
				</span>
			</button> */}
            <hr className="w-[100%] mt-2 border-gray-400"></hr>
			<div
				className={`transition-[max-height] duration-300 ease-in-out overflow-hidden mt-2 max-h-80 `}>
				<div className={``}>{content}</div>
			</div>
		</div>
	);
};

export default AccordionItem;