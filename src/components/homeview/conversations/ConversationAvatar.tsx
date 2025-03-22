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
                className={`rounded-full object-cover`}
                style={{ width: `${width * 4}px`, height: `${height * 4}px` }}
            />
        );
    }

    if (avatarCount === 1) {
        return (
            <img
                src={avatarUrls[0]}
                alt="avatar"
                className={`rounded-full object-cover`}
                style={{ width: `${width * 4}px`, height: `${height * 4}px` }}
            />
        );
    }

    
    if (avatarCount === 3) {
        return (
            <div className="relative"
            style={{ width: `${width * 4}px`, height: `${height * 4}px` }}>
            <img
                src={avatarUrls[0]}
                alt="avatar1"
                className="rounded-full object-cover absolute top-0 left-0 border-2 border-white"
                style={{ width: `${width * 2.2}px`, height: `${height * 2.2}px` }}
            />
            <img
                src={avatarUrls[1]}
                alt="avatar2"
                className="rounded-full object-cover absolute top-0 right-0 border-2 border-white"
                style={{ width: `${width * 2.2}px`, height: `${height * 2.2}px` }}
            />
            <img
                src={avatarUrls[2]}
                alt="avatar3"
                className="rounded-full object-cover absolute bottom-0 left-1/2 -translate-x-1/2 transform border-2 border-white"
                style={{ width: `${width * 2.2}px`, height: `${height * 2.2}px` }}
            />
            </div>
        );
    }

    return (
        <div className="relative"
            style={{ width: `${width * 4}px`, height: `${height * 4}px` }}>
            <img
                src={avatarUrls[0]}
                alt="avatar1"
                className="rounded-full object-cover absolute top-0 left-0 border-2 border-white"
                style={{ width: `${width * 2.2}px`, height: `${height * 2.2}px` }}
            />
            <img
                src={avatarUrls[1]}
                alt="avatar2"
                className="rounded-full object-cover absolute top-0 right-0 border-2 border-white"
                style={{ width: `${width * 2.2}px`, height: `${height * 2.2}px` }}
            />
            <img
                src={avatarUrls[2]}
                alt="avatar3"
                className="rounded-full object-cover absolute bottom-0 left-0 transform border-2 border-white"
                style={{ width: `${width * 2.2}px`, height: `${height * 2.2}px` }}
            />
            <img
                src={avatarUrls[3]}
                alt="avatar3"
                className="rounded-full object-cover absolute bottom-0 right-0 transform border-2 border-white"
                style={{ width: `${width * 2.2}px`, height: `${height * 2.2}px` }}
            />
        </div>
    );
};

export default ConversationAvatar;
