import { Stomp } from "@stomp/stompjs";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { ChatResponse } from "../types/Message";
import { useParams } from "react-router-dom";
import instance from "../services/Axios-customize";
import { ApiResponse } from "../types/backend";
import { UserTypingStatus } from "../types/UserStatus";
type UserTypingDisplay = {
    userId: string;
    isTyping: boolean;
};

type LastMessage = {
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: string;
};

// Type payloads tương ứng backend
type CallRequest = { from: string; fromName: string; fromAvatar: string; to: string; toName: string; callType: CallType; };
type OfferAnswer = { from: string; to: string; sdp: string, callType: string };
type IceCandidateMsg = { from: string; to: string; candidate: string };
type CallAction = { from: string; to: string; }; // Dùng cho HANGUP, REJECTED
type CallAccepted = { from: string; to: string; toAvatar: string; callType: string; }; // Dùng cho ACCEPTED

// Thêm các trạng thái cuộc gọi
export type CallState = "IDLE" | "OUTGOING" | "INCOMING" | "CONNECTED";
export type CallType = "audio" | "video";

interface AccessTokenResponse {
    access_token: string;
}

type ChatContextType = {
    lastMessages: Record<string, LastMessage>;
    updateLastMessage: (conversationId: string, senderId: string, content: string, timestamp: string) => void;

    // Media display
    displayMediaUrl: string | undefined;
    setDisplayMediaUrl: (url: string | undefined) => void;
    isDisplayMedia: boolean | null;
    setIsDisplayMedia: (open: boolean | null) => void;

    // WebSocket connection
    stompClientRef: any | null;
    isConnected: boolean;
    sendMessage: (message: any) => boolean;

    // Global message handling (cho tất cả các trang)
    globalMessages: ChatResponse[];
    currentNewMessage: ChatResponse | null;
    clearGlobalMessages: () => void;

    // Typing only
    typingMap: Record<string, UserTypingDisplay>;
    sendTypingStatus: (conversationId: string, isTyping: boolean) => void;
    getTypingStatus: (userId: string) => UserTypingDisplay | undefined;

    // Call functions
    callState: CallState;
    callType: CallType;
    incomingCallData: CallRequest | null;
    localVideoRef: any | null;
    localStreamRef: any | null;

    remoteVideoRef: any | null;
    remoteAudioRef: any | null;
    remoteStreamRef: any | null;
    localStreamReady: boolean;
    targetRef: any | null;
    // Debug helper to dump peer connection info and stats
    dumpPeerInfo: () => Promise<void>;

    setCallState: (callState: CallState) => void;
    callUser: (targetId: string, toName: string, callType: CallType) => void;
    handleIncomingCall: (req: CallRequest) => void;

    acceptCall: () => void;
    hangup: () => void;
    rejectCall: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    // States
    const [lastMessages, setLastMessages] = useState<Record<string, LastMessage>>({});
    const [displayMediaUrl, setDisplayMediaUrl] = useState<string | undefined>(undefined);
    const [isDisplayMedia, setIsDisplayMedia] = useState<boolean | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [globalMessages, setGlobalMessages] = useState<ChatResponse[]>([]);
    const [currentNewMessage, setCurrentNewMessage] = useState<ChatResponse | null>(null);

    const [callType, setCallType] = useState<CallType>("audio");
    const [callState, setCallState] = useState<CallState>("IDLE");
    const [incomingCallData, setIncomingCallData] = useState<CallRequest | null>(null);

    const [incomingCallAccepted, setIncomingCallAccepted] = useState<boolean | null>(null);
    const [callAccepted, setCallAccepted] = useState<boolean | null>(null);

    const [callStartTime, setCallStartTime] = useState<number | null>(null);
    const [localStreamReady, setLocalStreamReady] = useState(false);

    // Typing only
    const [typingMap, setTypingMap] = useState<Record<string, UserTypingDisplay>>({});
    const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

    // Refs
    const stompClientRef = useRef<any>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

    const targetRef = useRef<string | null>(null);

    const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    
    // State to trigger effect when remote stream is ready
    const [remoteStreamReady, setRemoteStreamReady] = useState(false);

    const updateLastMessage = useCallback((conversationId: string, senderId: string, content: string, timestamp: string) => {
        setLastMessages((prev) => ({
            ...prev,
            [conversationId]: { conversationId, senderId, content, timestamp },
        }));
    }, []);

    // Send typing status to WebSocket
    const sendTypingStatus = useCallback((conversationId: string, isTyping: boolean) => {
        if (!stompClientRef.current?.connected || !user) return;

        try {
            const typingMsg: UserTypingStatus = {
                userId: user.user.id,
                conversationId: conversationId,
                typing: isTyping,
                timestamp: new Date().toISOString()
            };
            stompClientRef.current.send("/app/user/typing", {}, JSON.stringify(typingMsg));
        } catch (error) {
            console.error("Failed to send typing status:", error);
        }
    }, [user]);

    // Get typing status from map
    const getTypingStatus = useCallback((userId: string): UserTypingDisplay | undefined => {
        return typingMap[userId];
    }, [typingMap]);

    // Global message handler - xử lý tin nhắn nhận được ở bất kỳ trang nào
    const handleGlobalMessage = useCallback((message: ChatResponse) => {
        console.log('Global message received:', message);

        // Thêm vào danh sách global messages
        setGlobalMessages(prev => [...prev, message]);

        // Cập nhật last message
        const timestamp = new Date().toISOString();
        updateLastMessage(message.conversationId, message.senderId, message.content, timestamp);

        // Show message notification nếu không đang ở trang chat đó
        if (message.type === 'message' && message.senderId !== user?.user.id) {
            const audio = new Audio('/sounds/new-message.mp3');
            audio.volume = 0.7;
            audio.play().catch(err => {
                console.warn('Không thể phát âm thanh:', err);
            });

            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('New message', {
                    body: message.content || 'Sent you a file',
                    icon: '/app-icon.png',
                    tag: `message-${message.conversationId}`
                });
            }
        }
    }, [user, updateLastMessage]);

    // Send message function
    const sendMessage = useCallback((message: any): boolean => {
        if (!stompClientRef.current?.connected) {
            console.error("WebSocket not connected");
            return false;
        }

        try {
            message.type = 'message';
            stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(message));
            return true;
        } catch (error) {
            console.error("Failed to send message:", error);
            return false;
        }
    }, []);

    // WebSocket connection function
    const connectWebSocket = useCallback(async () => {
        if (!user) return;
        try {
            const res = await instance.get<ApiResponse<AccessTokenResponse>>('/auth/refresh');
            if (!res || !res.data) return;
        } catch (err) {
            console.error("Failed to refresh token:", err);
        }

        // Cleanup existing connection
        if (stompClientRef.current?.connected) {
            console.log("Disconnecting existing WebSocket...");
            stompClientRef.current.disconnect();
        }

        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const client = Stomp.client(`${protocol}://${window.location.host.startsWith('localhost') ? 'localhost:8888' : window.location.host}/api/ws`);
        stompClientRef.current = client;

        client.connect({},
            (frame: any) => {
                console.log("Connected to WebSocket", frame);
                setIsConnected(true);
                reconnectAttempts.current = 0;

                // GLOBAL subscription - nhận tin nhắn và cuộc gọi ở mọi trang
                client.subscribe(`/topic/user/${user.user.id}`, (message: any) => {
                    const receivedMessage: ChatResponse = JSON.parse(message.body);
                    handleGlobalMessage(receivedMessage);

                    setCurrentNewMessage(receivedMessage);
                });

                // Subscribe to typing status
                client.subscribe(`/topic/user/${user.user.id}/typing`, (message: any) => {
                    const data: any = JSON.parse(message.body);
                    const typingStatus: UserTypingStatus = {
                        userId: data.userId,
                        conversationId: data.conversationId,
                        typing: data.typing ?? false,
                        timestamp: data.timestamp
                    };
                    console.log('🔥 Typing status received:', typingStatus);
                    setTypingMap(prev => {
                        const updated = {
                            ...prev,
                            [typingStatus.userId]: {
                                userId: typingStatus.userId,
                                isTyping: typingStatus.typing
                            }
                        };
                        console.log('🔥 Updated typing map:', updated);
                        return updated;
                    });
                    // Auto-clear typing status after 3 seconds of inactivity
                    if (typingTimeoutRef.current[typingStatus.userId]) {
                        clearTimeout(typingTimeoutRef.current[typingStatus.userId]);
                    }
                    if (typingStatus.typing) {
                        typingTimeoutRef.current[typingStatus.userId] = setTimeout(() => {
                            console.log('🔥 Auto-clearing typing for:', typingStatus.userId);
                            setTypingMap(prev => ({
                                ...prev,
                                [typingStatus.userId]: {
                                    ...prev[typingStatus.userId],
                                    isTyping: false
                                }
                            }));
                        }, 3000);
                    }
                });

                // subscribe to this user's private topic
                client.subscribe(`/topic/private-${user?.user.id}`, (msg) => {
                    if (!msg.body) return;
                    const data = JSON.parse(msg.body);
                    console.log("INCOMING:", data);

                    switch (data.type) {
                        case "CALL_REQUEST":
                            handleIncomingCall(data as CallRequest);
                            break;
                        case "CALL_ACCEPTED":
                            handleCallAccepted(data as CallAccepted);
                            break;
                        case "CALL_REJECTED":
                            handleCallRejected();
                            break;
                        case "OFFER":
                            handleRemoteSDP(data as OfferAnswer);
                            break;
                        case "ANSWER":
                            handleRemoteSDP(data as OfferAnswer);
                            break;
                        case "ICE":
                            handleRemoteIce(data as IceCandidateMsg);
                            break;
                        case "HANGUP":
                            handleHangupSignal();
                            break;
                    }
                });

            },
            (error: any) => {
                console.error("WebSocket connection failed:", error);
                setIsConnected(false);

                // Auto-reconnect with exponential backoff
                if (reconnectAttempts.current < 5) {
                    const delay = Math.pow(2, reconnectAttempts.current) * 1000;
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttempts.current += 1;
                        console.log(`Reconnection attempt ${reconnectAttempts.current}`);
                        connectWebSocket();
                    }, delay);
                }
            }
        );

        client.heartbeat.outgoing = 10000;
        client.heartbeat.incoming = 10000;

        setInterval(() => {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.send("/app/ping", {}, "ping");
            }
        }, 15000);

    }, [user, handleGlobalMessage]);

    // ===== Helper: Reorder video codecs in SDP to prioritize VP8/VP9 =====
    const reorderVideoCodecs = (sdp: string): string => {
        const lines = sdp.split('\n');
        let videoMLineIdx = -1;
        let videoPayloads: string[] = [];
        
        // Find m=video line
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('m=video')) {
                videoMLineIdx = i;
                const parts = lines[i].split(' ');
                videoPayloads = parts.slice(3); // Get codec payload numbers
                break;
            }
        }
        
        if (videoMLineIdx === -1) return sdp; // No video line
        
        // Find codec preferences (VP8=96, VP9=98, H264=103)
        const codecOrder = ['96', '98', '103', '104', '107', '108', '109']; // VP8, VP9, then H264 variants
        const reordered = videoPayloads.sort((a, b) => {
            const aIdx = codecOrder.indexOf(a);
            const bIdx = codecOrder.indexOf(b);
            return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
        });
        
        lines[videoMLineIdx] = 'm=video ' + lines[videoMLineIdx].split(' ').slice(1, 3).join(' ') + ' ' + reordered.join(' ');
        console.log('✓ Video codecs reordered: VP8/VP9 prioritized');
        return lines.join('\n');
    };

    // ===== Helper: Tạo và cấu hình RTCPeerConnection =====
    const createPeerConnection = async (callType: string) => {
        if (pcRef.current) {
            console.warn("PeerConnection đã tồn tại.");
            return pcRef.current;
        }

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },

                // {
                //     urls: 'turn:chitchat.pro.vn:3478',
                //     username: 'user',
                //     credential: 'pass'
                // },
                {
                    urls: 'turn:chitchat.pro.vn:5349?transport=tcp',
                    username: 'user',
                    credential: 'pass'
                },
                {
                    urls: 'turn:chitchat.pro.vn:3478?transport=udp',
                    username: 'user',
                    credential: 'pass'
                }
            ]
        });

        pc.onicecandidate = (event) => {
            if (event.candidate && targetRef.current && user) {
                const candidateMsg: IceCandidateMsg = {
                    from: user.user.id,
                    to: targetRef.current,
                    candidate: JSON.stringify(event.candidate)
                };
                stompClientRef.current?.send("/app/call/ice", {}, JSON.stringify(candidateMsg));
            }
        };

        pc.ontrack = (event) => {
            console.log("Remote track received, kind:", event.track.kind, "readyState:", event.track.readyState);

            // Create or reuse a single persistent MediaStream for all remote tracks
            if (!remoteStreamRef.current) {
                remoteStreamRef.current = new MediaStream();
                console.log("Created new remoteStream");
                // Signal that the stream is ready (will trigger effect in CallView)
                setRemoteStreamReady(true);
            }

            const remoteStream = remoteStreamRef.current;

            // Add the incoming track to the persistent stream
            try {
                remoteStream.addTrack(event.track);
                console.log("Added track to remoteStream. Stream now has audio:", remoteStream.getAudioTracks().length, "video:", remoteStream.getVideoTracks().length);
            } catch (e) {
                console.error("Failed to add track to remoteStream:", e);
                return;
            }

            // Let CallView effect handle the attachment to avoid duplicate attaches that trigger emptied events
            // (Previously attaching here + in effect caused emptied cascade)
            console.log("ontrack: deferring attachment to CallView effect");
        };

        // When we obtain local stream, log details for debugging
        // (This log will also help verify that audio/video tracks are present)
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia;

        pc.onconnectionstatechange = () => {
            console.log("Connection state:", pc.connectionState);
            if (pc.connectionState === "connected") {
                setCallState("CONNECTED");
                setCallStartTime(Date.now());
            }
            if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
                // Dọn dẹp nếu kết nối bị ngắt đột ngột
                // hangup();
                setIncomingCallAccepted(null);
                setCallAccepted(null);
                cleanupCall();
            }
        };

        // Add extra debug info about senders/receivers during lifecycle
        pc.addEventListener('signalingstatechange', () => {
            try {
                console.log('Signaling state changed:', pc.signalingState);
                console.log('Senders:', pc.getSenders().map(s => ({id: s.track?.id, kind: s.track?.kind, enabled: s.track?.enabled})));
                console.log('Receivers:', pc.getReceivers().map(r => ({id: r.track?.id, kind: r.track?.kind, readyState: r.track?.readyState})));
            } catch (e) { console.warn('Error logging pc state:', e); }
        });

        // Lấy stream của người dùng với constraints tối ưu hóa chất lượng
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: callType === "video" ? {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                } : false
            });
            localStreamRef.current = localStream;
            setLocalStreamReady(true);

            // Log what tracks we actually obtained
            try {
                console.log('Local stream obtained -> audioTracks:', localStream.getAudioTracks().map(t => ({id: t.id, enabled: t.enabled, muted: (t as any).muted})),
                    'videoTracks:', localStream.getVideoTracks().map(t => ({id: t.id, enabled: t.enabled})));
            } catch (e) { console.warn('Failed to inspect localStream tracks', e); }

            localStream.getTracks().forEach(track => {
                console.log('Adding local track to pc:', track.kind, track.id, 'enabled=', track.enabled);
                pc.addTrack(track, localStream);
            });

            try {
                console.log('After addTrack, pc.getSenders():', pc.getSenders().map(s => ({trackId: s.track?.id, kind: s.track?.kind, enabled: s.track?.enabled})));
            } catch (e) { console.warn('Failed to log pc senders', e); }

            // Optimize video sender bitrate limits (2.5 Mbps for quality)
            try {
                const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
                if (videoSender) {
                    const params = videoSender.getParameters();
                    if (params.encodings && params.encodings[0]) {
                        params.encodings[0].maxBitrate = 2500000; // 2.5 Mbps
                    }
                    await videoSender.setParameters(params);
                    console.log('✓ Video bitrate optimized: max 2.5M bps');
                }
            } catch (e) {
                console.warn('Failed to set video bitrate:', e);
            }

            if (localVideoRef.current && localStream.getVideoTracks().length > 0) {
                localVideoRef.current.srcObject = localStream;
                localVideoRef.current.muted = true;
                localVideoRef.current.play().catch(() => { });
            }
        } catch (err) {
            console.error("Không thể truy cập camera/microphone:", err);
            alert("Không thể truy cập camera/microphone. Vui lòng cấp quyền và thử lại.");
            return null; // Trả về null nếu không lấy được stream
        }

        pcRef.current = pc;
        return pc;
    };


    // ===== 1. Caller: Bắt đầu một cuộc gọi =====
    const callUser = (targetId: string, toName: string, callType: CallType) => {
        if (!user) return;
        targetRef.current = targetId;
        setCallState("OUTGOING");
        setCallType(callType);

        const payload: CallRequest = {
            from: user.user.id,
            fromName: user.user.firstName + ' ' + user.user.lastName,
            fromAvatar: user.user.avatarUrl,
            to: targetId,
            toName: toName,
            callType: callType
        };
        // Chỉ gửi yêu cầu, không tạo offer ngay lập tức
        stompClientRef.current?.send("/app/call/request", {}, JSON.stringify(payload));
        console.log("Call request sent to", targetId);
    };

    // ===== 2. Callee: Xử lý khi có cuộc gọi đến =====
    const handleIncomingCall = async (req: CallRequest) => {
        if (callState !== 'IDLE' && user?.user.id) {
            // Đang bận, tự động từ chối
            const rejectPayload: CallAction = { from: user.user.id, to: req.from };
            stompClientRef.current?.send("/app/call/reject", {}, JSON.stringify(rejectPayload));
            return;
        }
        setIncomingCallData(req);
        targetRef.current = req.from;
        setCallState("INCOMING");
        setCallType(req.callType);

        await createPeerConnection(req.callType);
    };

    // ===== 3a. Callee: Chấp nhận cuộc gọi =====
    const acceptCall = async () => {
        if (!incomingCallData || !user?.user.id) return;

        setIncomingCallAccepted(true);

        // QUAN TRỌNG: Chỉ chấp nhận và tạo PC nếu đang ở trạng thái INCOMING 
        // và PC chưa được tạo.
        if (callState !== "INCOMING" || pcRef.current) {
            console.warn("Đã chấp nhận hoặc PC đã tồn tại. Bỏ qua.");

            // Gửi tín hiệu chấp nhận
            const payload: CallAccepted = {
                from: user.user.id,
                to: incomingCallData.from,
                toAvatar: user.user.avatarUrl,
                callType: incomingCallData.callType
            };
            stompClientRef.current?.send("/app/call/accept", {}, JSON.stringify(payload));
        } else {

            // Gửi tín hiệu chấp nhận
            const payload: CallAccepted = {
                from: user.user.id,
                to: incomingCallData.from,
                toAvatar: user.user.avatarUrl,
                callType: incomingCallData.callType
            };
            stompClientRef.current?.send("/app/call/accept", {}, JSON.stringify(payload));

            // Bây giờ mới tạo PeerConnection để sẵn sàng nhận Offer
            // await createPeerConnection(incomingCallData.callType);
        }

        // setIncomingCallData(null);
        console.log("Call accepted, waiting for offer...");
    };

    // ===== 3b. Callee: Từ chối cuộc gọi =====
    const rejectCall = () => {
        if (!incomingCallData || !user?.user.id) return;
        const payload = {
            from: user.user.id,
            to: incomingCallData.from,
            duration: 0,
            callType: callType,
            status: "REJECTED",
        };
        stompClientRef.current?.send("/app/call/reject", {}, JSON.stringify(payload));

        // Reset trạng thái
        setCallState("IDLE");
        setIncomingCallAccepted(null);
        setIncomingCallData(null);
        setCallStartTime(null)
        targetRef.current = null;
    };

    // ===== 4. Caller: Xử lý khi callee đã chấp nhận =====
    const handleCallAccepted = async (msg: CallAccepted) => {
        console.log("Call accepted by", msg.from);

        setCallAccepted(true);

        let pc;

        if (pcRef.current) {
            console.warn("PC đã tồn tại. Bỏ qua tin nhắn CALL_ACCEPTED trùng lặp.");
            pc = pcRef.current;
        } else {
            // Callee đã đồng ý, bây giờ caller tạo PC và gửi Offer
            pc = await createPeerConnection(msg.callType);
        }

        if (!pc || !user?.user.id) {
            // Xử lý lỗi không tạo được PC
            hangup();
            return;
        }

        if (!pc.remoteDescription) {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Reorder video codecs to prioritize VP8/VP9
            let sdpStr = pc.localDescription?.sdp || '';
            sdpStr = reorderVideoCodecs(sdpStr);

            const payload: OfferAnswer = {
                from: user.user.id,
                to: msg.from,
                sdp: JSON.stringify({type: 'offer', sdp: sdpStr}),
                callType: msg.callType
            };
            stompClientRef.current?.send("/app/call/offer", {}, JSON.stringify(payload));
            console.log("Offer sent with optimized codecs");
        }
    };

    // ===== 5. Caller: Xử lý khi callee từ chối =====
    const handleCallRejected = () => {

        setCallAccepted(null);

        setCallStartTime(null);
        cleanupCall();
    };


    // ===== Xử lý SDP (Offer/Answer) =====
    const handleRemoteSDP = async (msg: OfferAnswer) => {
        // Lúc này pcRef.current phải luôn tồn tại
        if (!pcRef.current) {
            console.error("PeerConnection not initialized while receiving SDP!");
            return;
        }
        const pc = pcRef.current;
        const sdpObj = JSON.parse(msg.sdp) as RTCSessionDescriptionInit;

        try {
            await pc.setRemoteDescription(new RTCSessionDescription(sdpObj));
            console.log("Set remote description success");

            // Nếu là Callee nhận Offer
            if (sdpObj.type === "offer" && user?.user.id) {
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                // Reorder video codecs to prioritize VP8/VP9
                let sdpStr = pc.localDescription?.sdp || '';
                sdpStr = reorderVideoCodecs(sdpStr);

                const payload: OfferAnswer = {
                    from: user.user.id,
                    to: msg.from,
                    sdp: JSON.stringify({type: 'answer', sdp: sdpStr}),
                    callType: msg.callType
                };
                stompClientRef.current?.send("/app/call/answer", {}, JSON.stringify(payload));
                console.log("Answer sent with optimized codecs");
            }

            // Áp dụng các ICE candidate đang chờ
            await Promise.all(pendingCandidates.current.map(c => pc.addIceCandidate(c)));
            pendingCandidates.current = [];

        } catch (e) {
            console.error("Error handling remote SDP:", e);
        }
    };

    // ===== Xử lý ICE Candidate =====
    const handleRemoteIce = async (msg: IceCandidateMsg) => {
        try {
            const candidateObj = JSON.parse(msg.candidate);
            const candidate = new RTCIceCandidate(candidateObj);

            if (pcRef.current && pcRef.current.remoteDescription) {
                await pcRef.current.addIceCandidate(candidate);
            } else {
                // Nếu remote description chưa được set, tạm thời lưu lại
                pendingCandidates.current.push(candidate);
            }
        } catch (e) {
            console.error("Error adding remote ICE candidate:", e);
        }
    };

    // ===== Kết thúc cuộc gọi (chủ động) =====
    const hangup = () => {
        const durationSec =
            callStartTime ? Math.floor((Date.now() - callStartTime) / 1000) : 0;

        if (incomingCallData) {

            // Gửi payload lưu lịch sử
            const payload = {
                from: incomingCallData.from,
                to: user?.user.id,
                duration: durationSec,
                callType: callType,
                status: incomingCallAccepted == true ? "COMPLETED" : "MISSED",
            };
            console.log(payload);

            stompClientRef.current?.send("/app/call/hangup", {}, JSON.stringify(payload));
        } else if (user?.user.id) {

            // Gửi payload lưu lịch sử
            const payload = {
                from: user.user.id,
                to: targetRef.current,
                duration: durationSec,
                callType: callType,
                status: callAccepted == true ? "COMPLETED" : "MISSED",
            };
            console.log(payload);
            stompClientRef.current?.send("/app/call/hangup", {}, JSON.stringify(payload));
        }
        cleanupCall();
    };

    // ===== Xử lý tín hiệu kết thúc từ xa =====
    const handleHangupSignal = () => {
        console.log("Call ended by remote user.");
        cleanupCall();
    };

    // ===== Helper: Dọn dẹp tài nguyên =====
    const cleanupCall = () => {
        // Đóng PeerConnection
        pcRef.current?.close();
        pcRef.current = null;

        targetRef.current = null;
        pendingCandidates.current = [];
        setIncomingCallData(null);
        setIncomingCallAccepted(null);
        setCallAccepted(null);
        setCallStartTime(null);
        setCallState("IDLE");
        setRemoteStreamReady(false);

        // Dừng các track media
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;

        // Clear remote stream
        remoteStreamRef.current = null;

        // Reset các ref và state
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    };

    // Clear global messages
    const clearGlobalMessages = useCallback(() => {
        setGlobalMessages([]);
    }, []);

    // Debug helper: dump peer connection info and stats
    const dumpPeerInfo = async () => {
        const pc = pcRef.current;
        if (!pc) {
            console.warn('dumpPeerInfo: no RTCPeerConnection available');
            return;
        }

        try {
            console.log('--- dumpPeerInfo START ---');
            try {
                console.log('Transceivers:', pc.getTransceivers().map(t => ({mid: (t as any).mid, direction: t.direction, senderTrack: t.sender?.track?.id, receiverTrack: t.receiver?.track?.id})));
            } catch (e) { console.warn('Error logging transceivers', e); }

            try {
                console.log('Senders:', pc.getSenders().map(s => ({trackId: s.track?.id, kind: s.track?.kind, enabled: s.track?.enabled})));
                console.log('Receivers:', pc.getReceivers().map(r => ({trackId: r.track?.id, kind: r.track?.kind, readyState: r.track?.readyState})));
            } catch (e) { console.warn('Error logging senders/receivers', e); }

            console.log('localDescription', pc.localDescription);
            console.log('remoteDescription', pc.remoteDescription);

            try {
                const stats = await pc.getStats();
                stats.forEach((report: any) => {
                    if (report.type === 'inbound-rtp') {
                        // Try to detect video inbound-rtp
                        const maybeKind = report.mediaType || report.kind || report.mimeType;
                        if (maybeKind && String(maybeKind).toLowerCase().includes('video')) {
                            console.log('inbound-rtp (video):', report);
                        }
                    }
                    if (report.type === 'track' && report.kind === 'video') {
                        console.log('track report (video):', report);
                    }
                });
            } catch (e) {
                console.warn('Error getting pc.getStats()', e);
            }

            console.log('--- dumpPeerInfo END ---');
        } catch (e) {
            console.error('dumpPeerInfo unexpected error', e);
        }
    };

    // Main effect - khởi tạo WebSocket khi user login
    useEffect(() => {
        if (user) {
            connectWebSocket();

            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }

        return () => {
            // Cleanup
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            if (stompClientRef.current?.connected) {
                stompClientRef.current.disconnect();
            }
        };
    }, [user, connectWebSocket]);

    // Effect to attach remote stream to audio/video elements when they are mounted
    useEffect(() => {
        if (remoteStreamReady && remoteStreamRef.current) {
            const remoteStream = remoteStreamRef.current;
            console.log("💬 Remote stream ready in context. Audio tracks:", remoteStream.getAudioTracks().length, "Video tracks:", remoteStream.getVideoTracks().length);
            
            // Just log - CallView will handle attachment
        }
    }, [remoteStreamReady]);

    return (
        <ChatContext.Provider value={{
            lastMessages,
            updateLastMessage,
            displayMediaUrl,
            setDisplayMediaUrl,
            isDisplayMedia,
            setIsDisplayMedia,
            stompClientRef,
            isConnected,
            sendMessage,
            globalMessages,
            currentNewMessage,
            clearGlobalMessages,

            typingMap,
            sendTypingStatus,
            getTypingStatus,

            callState,
            callType,
            incomingCallData,

            localVideoRef,
            localStreamRef,
            localStreamReady,

            remoteVideoRef,
            remoteAudioRef,
            remoteStreamRef,
            targetRef,
            dumpPeerInfo,

            setCallState,
            callUser,
            handleIncomingCall,

            acceptCall,
            hangup,
            rejectCall
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
};