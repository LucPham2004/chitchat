import React from 'react';
import { MediaResponse } from '../../../../types/Media';
import { useChatContext } from '../../../../utilities/ChatContext';

interface MediaGridProps {
	medias: MediaResponse[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ medias }) => {

	const { setIsDisplayMedia } = useChatContext();
	const { setDisplayMediaUrl } = useChatContext();
	return (
		<div className="grid grid-cols-3 gap-1">
			{medias.map((media, index) => (
				<div key={index} className="overflow-hidden shadow-md">
					<img
						src={media.url}
						alt={`Media ${index + 1}`}
						className="w-full h-24 object-cover cursor-pointer"
						onClick={() => {
							setDisplayMediaUrl(media.url);
							setIsDisplayMedia(true);
						}}
					/>
				</div>
			))}
		</div>
	);
};

export default MediaGrid;
