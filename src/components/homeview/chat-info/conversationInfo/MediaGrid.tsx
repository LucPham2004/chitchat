import React from 'react';
import { MediaResponse } from '../../../../types/Media';

interface MediaGridProps {
  medias: MediaResponse[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ medias }) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {medias.map((media, index) => (
        <div key={index} className="overflow-hidden shadow-md">
          <img
            src={media.url}
            alt={`Media ${index + 1}`}
            className="w-full h-24 object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
