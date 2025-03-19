
interface AvatarProps {
    avatarUrl: string;
    width: number;
    height: number;
}

const Avatar: React.FC<AvatarProps> = ({ avatarUrl, width, height }) => {

    return (
        <div className={`max-w-[160px] max-h-[160px]`}>
            <img
                src={avatarUrl}
                alt="avatar"
                style={{ width: `${width * 4}px`, height: `${height * 4}px` }}
                className="rounded-full object-cover"
            />
        </div>
    );
};

export default Avatar;