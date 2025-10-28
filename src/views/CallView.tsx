import { useState, useEffect } from "react";
import { useAuth } from "../utilities/AuthContext";
import { useChatContext } from "../utilities/ChatContext";
import { useSearchParams } from "react-router-dom";

export default function CallComponent() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const { isConnected, remoteStreamRef, localVideoRef, callUser, hangup } = useChatContext();
  const [isCalling, setIsCalling] = useState(false);

  // Bắt đầu cuộc gọi
  const handleCall = () => {
    const input = recipientId;
    console.log(input)
    if (input) {
      callUser(input);
      setIsCalling(true);
    }
  };

  // Kết thúc cuộc gọi
  const handleHangup = () => {
    hangup();
    setIsCalling(false);
  };

  useEffect(() => {
    const r = searchParams.get("r");
    setRecipientId(r);

    handleCall();
  }, [searchParams]);

  return (
    <div className="p-4">
      {/* Modal cuộc gọi */}
      {isCalling && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl flex flex-col gap-4">
            {/* Thông tin người gọi */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white">
                Cuộc gọi với {user?.user.id}
              </h2>
              <p className="text-gray-400">
                {isConnected ? "Đang kết nối..." : "Đã ngắt kết nối"}
              </p>
            </div>

            {/* Video hiển thị */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-48 h-36 md:w-64 md:h-48 rounded-lg bg-black"
                />
                <span className="absolute bottom-2 left-2 text-white text-sm bg-gray-800 bg-opacity-50 px-2 py-1 rounded">
                  Bạn
                </span>
              </div>
              <div className="relative">
                <video
                  ref={remoteStreamRef}
                  autoPlay
                  playsInline
                  className="w-64 h-48 md:w-96 md:h-64 rounded-lg bg-black"
                />
                <span className="absolute bottom-2 left-2 text-white text-sm bg-gray-800 bg-opacity-50 px-2 py-1 rounded">
                  Người nhận
                </span>
              </div>
            </div>

            {/* Nút điều khiển */}
            <div className="flex justify-center gap-4 mt-4">
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