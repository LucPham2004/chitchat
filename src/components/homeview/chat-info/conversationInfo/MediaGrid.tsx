import React from 'react';

interface MediaGridProps {
  medias: string[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ medias }) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {medias.map((media, index) => (
        <div key={index} className="overflow-hidden shadow-md">
          <img
            src={media}
            alt={`Media ${index + 1}`}
            className="w-full h-24 object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
