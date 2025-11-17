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
	isGroup?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
	title, 
	content, 
	toggleAccordion, 
	index, 
	openIndices, 
	hidden,
	isGroup,
 }) => {
	const { isDarkMode  } = useTheme();

	if (hidden) return null;

	return (
		isGroup ? 
		<div className="">
			<button
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
			</button>
			<div
				className={`transition-[max-height] duration-300 ease-in-out overflow-hidden mt-2
				${openIndices.includes(index) ? 'max-h-80' : 'max-h-0'}`}>
				<div className={``}>{content}</div>
			</div>
		</div>
		: 
		<div>
            <hr className="w-[100%] mt-2 border-gray-600"></hr>
			<div
				className={`transition-[max-height] duration-300 ease-in-out overflow-hidden mt-2 max-h-80 `}>
				<div className={``}>{content}</div>
			</div>
		</div>
	);
};

export default AccordionItem;