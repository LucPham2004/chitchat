import { useState, useEffect } from "react";
import { useAuth } from "../utilities/AuthContext";
import { useChatContext } from "../utilities/ChatContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOtherUserById } from "../services/UserService";
import { UserDTO } from "../types/User";
import Avatar from "../components/common/Avatar";

export default function CallComponent() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [callType, setCallType] = useState<string | null>("audio");
  const [recipient, setRecipient] = useState<UserDTO | null>(null);
  const { isConnected, remoteStreamRef, localVideoRef, callUser, hangup } = useChatContext();
  const [isCalling, setIsCalling] = useState(false);

  const fetchUser = async () => {
    try {
      if (user?.user.id && recipientId) {
        const response = await getOtherUserById(user?.user.id, recipientId);
        if (response.result) {
          setRecipient(response.result);
        }

      } else {
        throw new Error("User ID is undefined");
      }
    } catch (error) { }
  };

  // Bắt đầu cuộc gọi
  const handleCall = () => {
    console.log(recipientId)
    if (recipientId && callType) {
      callUser(recipientId, callType);
      setIsCalling(true);
    }
  };

  // Kết thúc cuộc gọi
  const handleHangup = () => {
    hangup();
    setIsCalling(false);
    navigate(-1);
  };

  useEffect(() => {
    const r = searchParams.get("r");
    const callType = searchParams.get("t");

    setRecipientId(r);
    setCallType(callType);
  }, [searchParams]);

  useEffect(() => {
    if (recipientId && callType) {
      fetchUser();
      handleCall();
    }
  }, [recipientId]);

  return (
    <div className="">
      {/* Modal cuộc gọi */}
      {isCalling && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl w-full flex flex-col gap-4">

            {/* Video hiển thị */}
            <div className="relative w-full h-screen bg-black overflow-hidden">
              {/* Video của người kia — full màn hình */}

              {remoteStreamRef.current ? (
                <video
                  ref={remoteStreamRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col gap-2 items-center justify-center w-full h-full bg-black text-white text-lg">
                  <Avatar avatarUrl={recipient ? recipient.avatarUrl : '/user_default.avif'} width={28} height={28}></Avatar>
                  <p>
                    {`${recipient?.firstName + " " + recipient?.lastName}`}
                  </p>
                </div>
              )}

              {/* Video của bạn — nhỏ ở góc trên trái */}
              {callType == 'video' && (
                <div className="absolute top-4 left-4 w-40 h-32 md:w-56 md:h-40 border-2 border-white rounded-lg overflow-hidden shadow-lg">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover bg-black"
                  />
                  <span className="absolute bottom-1 left-1 text-white text-xs bg-gray-800 bg-opacity-50 px-1 rounded">
                    Bạn
                  </span>
                </div>
              )}
            </div>

            {/* Nút điều khiển */}
            <div className="absolute bottom-6 w-full flex justify-center gap-4 mt-4">
              <button
                className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition"
                title="Tắt tiếng"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              <button
                className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition"
                title="Tắt camera"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                onClick={handleHangup}
                className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition"
                title="Kết thúc cuộc gọi"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}