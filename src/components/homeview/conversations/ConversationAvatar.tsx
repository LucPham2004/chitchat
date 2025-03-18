import React from 'react';

interface ConversationAvatarProps {
    avatarUrls: string[];
    width: number;
    height: number;
}

const ConversationAvatar: React.FC<ConversationAvatarProps> = ({ avatarUrls, width, height }) => {
    const avatarCount = avatarUrls.length;

    if (avatarCount === 0) {
        return (
            <img
                src={'/user_default.avif'}
                alt="avatar"
                className={`w-${width} h-${height} rounded-full object-cover`}
            />
        );
    }

    if (avatarCount === 1) {
        return (
            <img
                src={avatarUrls[0]}
                alt="avatar"
                className={`w-${width} h-${height} rounded-full object-cover`}
            />
        );
    }

    return (
        <div className="relative w-10 h-10">
            <img
                src={avatarUrls[0]}
                alt="avatar1"
                className="w-6 h-6 rounded-full object-cover absolute top-0 left-0 border-2 border-white"
            />
            <img
                src={avatarUrls[1]}
                alt="avatar2"
                className="w-6 h-6 rounded-full object-cover absolute top-0 right-0 border-2 border-white"
            />
            <img
                src={avatarUrls[2]}
                alt="avatar3"
                className="w-6 h-6 rounded-full object-cover absolute bottom-0 left-1/2 transform -translate-x-1/2 border-2 border-white"
            />
        </div>
    );
};

export default ConversationAvatar;
