
interface AvatarProps {
    avatarUrl: string;
    width: number;
    height: number;
}

const Avatar: React.FC<AvatarProps> = ({ avatarUrl, width, height }) => {

    return (
        <img
            src={avatarUrl}
            alt="avatar"
            className={`w-${width} h-${height} rounded-full object-cover`}
        />
    );
};

export default Avatar;