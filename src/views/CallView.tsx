import { useState, useEffect, useRef } from "react";
import { useAuth } from "../utilities/AuthContext";
import { useChatContext } from "../utilities/ChatContext";
import { getOtherUserById } from "../services/UserService";
import Avatar from "../components/common/Avatar";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";


export default function CallView() {
  const { user } = useAuth();

  const {
    callState,      // Trạng thái cuộc gọi toàn cục (IDLE, OUTGOING, INCOMING, CONNECTED)
    callType,
    setCallState,
    hangup,         // Hàm để kết thúc cuộc gọi
    incomingCallData,
    targetRef,
    localVideoRef,
    localStreamRef, // Ref cho stream của bạn
    remoteVideoRef,
    remoteAudioRef,
    remoteStreamRef,
    localStreamReady,
    dumpPeerInfo,
  } = useChatContext();

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [otherParty, setOtherParty] = useState<any>(null);

  const callingAudioRef = useRef<HTMLAudioElement | null>(null);

  const [playError, setPlayError] = useState<string | null>(null);

  const [videoAttached, setVideoAttached] = useState(false);
  const [audioAttached, setAudioAttached] = useState(false);

  // Effect to attach remote stream when it becomes available (ONLY ONCE per stream)
  useEffect(() => {
    if (remoteStreamRef?.current) {
      const remoteStream = remoteStreamRef.current;
      console.log("📹 CallView: remoteStreamRef available. Audio:", remoteStream.getAudioTracks().length, "Video:", remoteStream.getVideoTracks().length);

      // Attach audio if possible (and not already attached)
      if (!audioAttached && remoteAudioRef.current && remoteStream.getAudioTracks().length > 0) {
        try {
          remoteAudioRef.current.srcObject = remoteStream;
          remoteAudioRef.current.muted = false;
          remoteAudioRef.current.volume = 1;
          console.log("✓ Remote audio attached in CallView");
          // Try to play with deferred call
          setTimeout(() => {
            remoteAudioRef.current?.play().catch(() => {});
          }, 150);
          setAudioAttached(true);
        } catch (e) {
          console.error("Failed to attach remote audio in CallView:", e);
        }
      }

      // Attach video if possible (and not already attached)
      if (!videoAttached && remoteVideoRef.current && remoteStream.getVideoTracks().length > 0) {
        try {
          // Mute the video element so browsers allow autoplay of the visual
          remoteVideoRef.current.muted = true;
          remoteVideoRef.current.srcObject = remoteStream;
          console.log("✓ Remote video attached in CallView (muted for autoplay)");
          // Try to play with deferred call
          setTimeout(() => {
            remoteVideoRef.current?.play().catch(() => {});
          }, 150);
          setVideoAttached(true);
        } catch (e) {
          console.error("Failed to attach remote video in CallView:", e);
        }
      }
    }
  }, [remoteStreamRef?.current]);

  // Fallback effect: after callState becomes CONNECTED, try attaching again
  // (This fixes the caller-side issue where video ref wasn't mounted when stream arrived)
  useEffect(() => {
    if (callState === 'CONNECTED' && remoteStreamRef?.current && !videoAttached) {
      const remoteStream = remoteStreamRef.current;
      if (remoteVideoRef.current && remoteStream.getVideoTracks().length > 0 && !remoteVideoRef.current.srcObject) {
        console.log("📹 FALLBACK: Caller-side attachment - remoteVideoRef now exists, attaching stream");
        try {
          remoteVideoRef.current.muted = true;
          remoteVideoRef.current.srcObject = remoteStream;
          console.log("✓ Remote video attached via fallback");
          setTimeout(() => {
            remoteVideoRef.current?.play().catch(() => {});
          }, 100);
          setVideoAttached(true);
        } catch (e) {
          console.error("Fallback attachment failed:", e);
        }
      }
    }
  }, [callState]);

  // Attach media event listeners to remote video for better diagnostics
  useEffect(() => {
    const v = remoteVideoRef.current;
    if (!v) return;

    const handlers: Record<string, EventListener> = {};
    const events = ['loadedmetadata', 'loadeddata', 'play', 'playing', 'pause', 'emptied', 'stalled', 'suspend', 'waiting', 'error'];

    events.forEach((ev) => {
      const h = (e: Event) => {
        console.log(`remoteVideo event: ${ev}`, e);
        try {
          console.log('video readyState', v.readyState, 'networkState', v.networkState, 'videoWidth', v.videoWidth, 'videoHeight', v.videoHeight);
        } catch (err) { }

        // Auto-recovery: if emptied, try to reattach after a short delay
        if (ev === 'emptied') {
          console.warn('Video emptied detected - will attempt reattach');
          setTimeout(() => {
            try {
              if (remoteStreamRef?.current && v.srcObject === remoteStreamRef.current) {
                // Already attached; try play() to restart
                v.play().catch(() => {});
              } else if (remoteStreamRef?.current) {
                // Reattach
                v.srcObject = remoteStreamRef.current as any;
                v.play().catch(() => {});
              }
            } catch (err) {
              console.warn('Reattach on emptied failed', err);
            }
          }, 100);
        }
      };
      handlers[ev] = h;
      v.addEventListener(ev, h);
    });

    return () => {
      events.forEach(ev => {
        v.removeEventListener(ev, handlers[ev]);
      });
    };
  }, [remoteVideoRef.current]);

  // Attach local stream to local video element when ready
  useEffect(() => {
    if (localStreamRef?.current && localVideoRef?.current && localStreamReady) {
      try {
        const localStream = localStreamRef.current;
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.muted = true;
        localVideoRef.current.play().catch((e: any) => console.warn('Local video play prevented:', e));
        console.log('✓ Local stream attached to localVideoRef in CallView');
      } catch (e) {
        console.error('Failed to attach local stream in CallView:', e);
      }
    }
  }, [localStreamReady, localStreamRef, localVideoRef]);

  // Fallback: if local stream was obtained before the local <video> mounted,
  // attach it when the UI transitions to CONNECTED and the video ref exists.
  useEffect(() => {
    if (callState === 'CONNECTED' && localStreamRef?.current && localStreamReady) {
      const ls = localStreamRef.current;
      if (localVideoRef.current && !localVideoRef.current.srcObject) {
        try {
          localVideoRef.current.srcObject = ls;
          localVideoRef.current.muted = true;
          localVideoRef.current.play().catch(() => {});
          console.log('✓ Local stream attached via fallback in CallView');
        } catch (e) {
          console.error('Fallback attach local stream failed:', e);
        }
      }
    }
  }, [callState, localStreamReady]);

  // Effect to attach remote stream when this component mounts
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, [remoteAudioRef, remoteVideoRef]);

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
          const response = await getOtherUserById(user?.user.id, incomingCallData.from);
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
    setVideoAttached(false);
    setAudioAttached(false);
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
    // setCallState("IDLE");
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
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full bg-gradient-to-br 
    from-[#555555] via-[#3c5559] to-[#242424] text-white">
      <Avatar avatarUrl={otherParty ? otherParty.avatarUrl : '/images/user_default.avif'} width={32} height={32} />
      <p className="text-2xl font-bold">{otherParty ? `${otherParty.firstName} ${otherParty.lastName}` : "..."}</p>
      <p className="text-lg animate-pulse">Đang gọi...</p>
    </div>
  );

  // Giao diện khi cuộc gọi đã được kết nối
  const renderConnectedCall = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#555555] via-[#3c5559] to-[#242424] overflow-hidden">
      {/* Remote video fills the screen */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {(callType == 'audio') && (
        <div className="flex flex-col gap-2 items-center justify-center w-full h-full bg-gradient-to-br from-[#555555] via-[#3c5559] to-[#242424] text-white text-lg">
          <Avatar avatarUrl={otherParty ? otherParty.avatarUrl : '/images/user_default.avif'} width={28} height={28} />
          <p>{otherParty?.firstName} {otherParty?.lastName}</p>
        </div>
      )}

      {/* Local video preview in corner */}
      {callType == 'video' && (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-4 right-4 w-40 h-32 md:w-56 md:h-40 border-2 border-white rounded-lg overflow-hidden shadow-lg bg-black z-20"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl w-full h-full flex flex-col relative">
        {/* Audio element for remote audio playback */}
        <audio ref={remoteAudioRef} autoPlay playsInline />

        {/* Chọn giao diện để render */}
        {callState === 'OUTGOING' && renderOutgoingCall()}
        {callState === 'CONNECTED' && renderConnectedCall()}

        {/* Debug panel to inspect video elements */}
        {/* {callState === 'CONNECTED' && ( */}
        {false && (
          <div className="absolute top-4 left-4 z-30 bg-black bg-opacity-75 text-white text-xs p-2 rounded max-w-xs">
            <div>Remote video srcObject: {remoteVideoRef.current?.srcObject ? '✓ attached' : '✗ none'}</div>
            {remoteVideoRef.current?.srcObject && (
              <div>Remote video tracks: {(remoteVideoRef.current.srcObject as MediaStream).getVideoTracks().length}</div>
            )}
            <div>Remote video readyState: {remoteVideoRef.current?.readyState}</div>
            <div>Remote video networkState: {remoteVideoRef.current?.networkState}</div>
            <div className="mt-1 text-xs">
              <button
                onClick={() => {
                  if (remoteVideoRef.current) {
                    console.log('Manual play attempt');
                    remoteVideoRef.current.play().catch((e: any) => console.error('Play failed:', e));
                  }
                }}
                className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"
              >
                Play
              </button>
            </div>
            <div className="mt-2 text-xs space-x-2">
              <button
                onClick={() => {
                  // Force clear and reattach srcObject
                  try {
                    console.log('Reattach: clearing srcObject then reassigning');
                    if (remoteVideoRef.current) {
                      const prev = remoteVideoRef.current.srcObject;
                      remoteVideoRef.current.srcObject = null;
                      setTimeout(() => {
                        remoteVideoRef.current!.srcObject = prev as any;
                        remoteVideoRef.current!.play().catch((e: any) => console.warn('Reattach play failed', e));
                      }, 120);
                    }
                  } catch (e) {
                    console.error('Reattach error', e);
                  }
                }}
                className="px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-500"
              >
                Reattach
              </button>

              <button
                onClick={() => {
                  // Force attach: surgically swap the video track in the existing stream
                  try {
                    const rs = remoteStreamRef?.current;
                    const vRef = remoteVideoRef.current;
                    if (rs && vRef && vRef.srcObject === rs) {
                      // Track is already attached; try to refresh by toggling track enabled state
                      const videoTrack = rs.getVideoTracks()[0];
                      if (videoTrack) {
                        console.log('Force attach: toggling video track enabled state');
                        const wasEnabled = videoTrack.enabled;
                        videoTrack.enabled = false;
                        setTimeout(() => {
                          videoTrack.enabled = wasEnabled;
                          console.log('Video track re-enabled');
                        }, 50);
                      }
                    } else if (rs && vRef) {
                      // Reattach the stream (will cause emptied but recover)
                      console.log('Force attach: reattaching entire stream');
                      vRef.srcObject = rs as any;
                      vRef.play().catch((e: any) => console.warn('Force attach play failed', e));
                    }
                  } catch (e) {
                    console.error('Force attach error', e);
                  }
                }}
                className="px-2 py-1 bg-green-600 rounded hover:bg-green-500"
              >
                Force Attach
              </button>

              <button
                onClick={() => {
                  try {
                    console.log('Info: remoteStreamRef, remoteVideoRef state');
                    console.log('remoteStreamRef', remoteStreamRef?.current);
                    console.log('remoteVideoRef', remoteVideoRef?.current);
                    if (remoteVideoRef.current) {
                      console.log('video readyState', remoteVideoRef.current.readyState, 'networkState', remoteVideoRef.current.networkState, 'videoWidth', remoteVideoRef.current.videoWidth, 'videoHeight', remoteVideoRef.current.videoHeight);
                    }
                    // Try requestVideoFrameCallback if available
                    const v = remoteVideoRef.current as any;
                    if (v && typeof v.requestVideoFrameCallback === 'function') {
                      v.requestVideoFrameCallback((now: any, meta: any) => {
                        console.log('requestVideoFrameCallback frame meta', meta);
                      });
                    }
                  } catch (e) {
                    console.error('Info error', e);
                  }
                }}
                className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-500"
              >
                Info
              </button>
              <button
                onClick={async () => {
                  try {
                    if (typeof dumpPeerInfo === 'function') {
                      await dumpPeerInfo();
                    } else {
                      console.warn('dumpPeerInfo not available');
                    }
                  } catch (e) {
                    console.error('dumpPeerInfo call failed', e);
                  }
                }}
                className="px-2 py-1 bg-indigo-600 rounded hover:bg-indigo-500"
              >
                Dump Peer
              </button>
            </div>
          </div>
        )}

        {/* Các nút điều khiển luôn hiển thị ở dưới */}
        <div className="absolute bottom-6 w-full flex justify-center gap-4 mt-4 z-10">
          <button onClick={toggleMute} 
          className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition" 
          title={isMuted ? "Bật tiếng" : "Tắt tiếng"}>
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          {callType === 'video' && (
            <button onClick={toggleCamera} 
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition" 
            title={isCameraOff ? "Bật camera" : "Tắt camera"}>
              {isCameraOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>
          )}

          <button onClick={handleHangup} 
          className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition" 
          title="Kết thúc cuộc gọi">
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
