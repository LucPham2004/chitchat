import { useState, useEffect, useRef } from "react";
import { useAuth } from "../utilities/AuthContext";
import { useChatContext } from "../utilities/ChatContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOtherUserById } from "../services/UserService";
import { UserDTO } from "../types/User";
import Avatar from "../components/common/Avatar";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"; // Ví dụ dùng icon từ lucide-react


export default function CallView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callType = searchParams.get("t");

  const {
    callState,      // Trạng thái cuộc gọi toàn cục (IDLE, OUTGOING, INCOMING, CONNECTED)
    hangup,         // Hàm để kết thúc cuộc gọi
    incomingCallData,
    targetRef,
    localVideoRef,
    localStreamRef, // Ref cho stream của bạn
    remoteStreamRef // Ref cho stream của người kia
  } = useChatContext();

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [otherParty, setOtherParty] = useState<any>(null);

  const callingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Phát âm thanh gọi đi khi trạng thái OUTGOING
  useEffect(() => {
    if (callState === "OUTGOING") {
      // Nếu chưa có âm thanh, tạo mới
      if (!callingAudioRef.current) {
        const audio = new Audio("/sounds/calling.mp3");
        audio.loop = true;
        audio.volume = 0.6;
        callingAudioRef.current = audio;
      }

      // Phát nhạc chuông an toàn
      callingAudioRef.current
        .play()
        .then(() => console.log("🔊 Playing calling tone"))
        .catch((err) => console.warn("⚠️ Failed to play calling tone:", err));
    }
    else if (callState === "CONNECTED" || callState === "IDLE" || callState === "INCOMING") {
      // Dừng an toàn khi chuyển trạng thái khác
      if (callingAudioRef.current && !callingAudioRef.current.paused) {
        try {
          callingAudioRef.current.pause();
          callingAudioRef.current.currentTime = 0;
        } catch (err) {
          console.warn("⚠️ Error stopping ringtone:", err);
        }
      }
    }

    // Cleanup khi component bị unmount
    return () => {
      if (callingAudioRef.current) {
        try {
          callingAudioRef.current.pause();
          callingAudioRef.current.currentTime = 0;
        } catch (err) { }
        callingAudioRef.current = null;
      }
    };
  }, [callState]);

  useEffect(() => {
    // Logic để lấy thông tin người kia
    const getOtherUser = async () => {
      if (user?.user.id) {
        if (callState === 'OUTGOING' && targetRef.current) {
          // Lấy thông tin người mình đang gọi
          const response = await getOtherUserById(user?.user.id, targetRef.current);
          if (response.code == 1000) {
            setOtherParty(response.result);
          }
        } else if (incomingCallData) {
          // Lấy thông tin người đang gọi mình
          const response = await getOtherUserById(user?.user.id, targetRef.current);
          if (response.code == 1000) {
            setOtherParty(response.result);
          }
        }
      }
    }

    getOtherUser();

  }, [callState, incomingCallData, targetRef.current]);

  // === HÀM ĐIỀU KHIỂN ===

  const handleHangup = () => {
    if (callingAudioRef.current) {
      try {
        callingAudioRef.current.pause();
        callingAudioRef.current.currentTime = 0;
      } catch (err) { }
      callingAudioRef.current = null;
    }

    // Dừng stream của mình
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track: any) => track.stop());
    }

    hangup();
  };

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(prev => !prev);
    }
  };

  const toggleCamera = () => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(prev => !prev);
    }
  };


  // === RENDER LOGIC DỰA TRÊN CALLSTATE ===

  // Giao diện khi đang gọi đi, chờ đối phương trả lời
  const renderOutgoingCall = () => (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full bg-gradient-to-br from-[#555555] via-[#3c5559] to-[#242424] text-white">
      <Avatar avatarUrl={otherParty ? otherParty.avatarUrl : '/images/user_default.avif'} width={32} height={32} />
      <p className="text-2xl font-bold">{otherParty ? `${otherParty.firstName} ${otherParty.lastName}` : "..."}</p>
      <p className="text-lg animate-pulse">Đang gọi...</p>
    </div>
  );

  // Giao diện khi cuộc gọi đã được kết nối
  const renderConnectedCall = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#555555] via-[#3c5559] to-[#242424] overflow-hidden">
      {/* Video của người kia — full màn hình */}
      {callType === 'video' && (
        <video
          ref={remoteStreamRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: remoteStreamRef.current?.srcObject ? 'block' : 'none' }}
        />
      )}
      {/* Hiển thị avatar nếu chưa có stream hoặc là cuộc gọi audio */}
      {(!remoteStreamRef.current?.srcObject || callType === 'audio') && (
        <div className="flex flex-col gap-2 items-center justify-center w-full h-full bg-black text-white text-lg">
          <Avatar avatarUrl={otherParty ? otherParty.avatarUrl : '/images/user_default.avif'} width={28} height={28} />
          <p>{otherParty?.firstName} {otherParty?.lastName}</p>
        </div>
      )}

      {/* Video của bạn — nhỏ ở góc */}
      {callType === 'video' && (
        <div className="absolute top-4 right-4 w-40 h-32 md:w-56 md:h-40 border-2 border-white rounded-lg overflow-hidden shadow-lg bg-black">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl w-full h-full flex flex-col">
        {/* Chọn giao diện để render */}
        {callState === 'OUTGOING' && renderOutgoingCall()}
        {callState === 'CONNECTED' && renderConnectedCall()}

        <audio
          ref={remoteStreamRef}
          autoPlay
          playsInline
          className="hidden"
        />

        {/* Các nút điều khiển luôn hiển thị ở dưới */}
        <div className="absolute bottom-6 w-full flex justify-center gap-4 mt-4 z-10">
          <button onClick={toggleMute} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition" title={isMuted ? "Bật tiếng" : "Tắt tiếng"}>
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          {callType === 'video' && (
            <button onClick={toggleCamera} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition" title={isCameraOff ? "Bật camera" : "Tắt camera"}>
              {isCameraOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>
          )}

          <button onClick={handleHangup} className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition" title="Kết thúc cuộc gọi">
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}