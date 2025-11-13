import { Stomp } from "@stomp/stompjs";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { ChatResponse } from "../types/Message";
import { useParams } from "react-router-dom";
import instance from "../services/Axios-customize";
import { ApiResponse } from "../types/backend";

type LastMessage = {
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: string;
};

// Type payloads tương ứng backend
type CallRequest = { from: string; fromName: string; fromAvatar: string; to: string; toName: string; callType: string; };
type OfferAnswer = { from: string; to: string; sdp: string, callType: string };
type IceCandidateMsg = { from: string; to: string; candidate: string };
type CallAction = { from: string; to: string; }; // Dùng cho HANGUP, REJECTED
type CallAccepted = { from: string; to: string; toAvatar: string; callType: string; }; // Dùng cho ACCEPTED

// Thêm các trạng thái cuộc gọi
export type CallState = "IDLE" | "OUTGOING" | "INCOMING" | "CONNECTED";

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

    // Conversation-specific subscriptions (cho MainChat)
    subscribeToConversation: (conversationId: string, callback: (message: ChatResponse) => void) => () => void;

    // Call functions
    callState: CallState;
    incomingCallData: CallRequest | null;
    localVideoRef: any | null;
    localStreamRef: any | null;

    remoteVideoRef: any | null;
    remoteAudioRef: any | null;
    targetRef: any | null;

    setCallState: (callState: CallState) => void;
    callUser: (targetId: string, toName: string, callType: string) => void;
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

    const [callType, setCallType] = useState<string>("audio");
    const [callState, setCallState] = useState<CallState>("IDLE");
    const [incomingCallData, setIncomingCallData] = useState<CallRequest | null>(null);

    const [callStartTime, setCallStartTime] = useState<number | null>(null);

    // Refs
    const stompClientRef = useRef<any>(null);
    const conversationSubscriptionsRef = useRef<Map<string, any>>(new Map());
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

    const targetRef = useRef<string | null>(null);

    const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

    const updateLastMessage = useCallback((conversationId: string, senderId: string, content: string, timestamp: string) => {
        setLastMessages((prev) => ({
            ...prev,
            [conversationId]: { conversationId, senderId, content, timestamp },
        }));
    }, []);

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

                // Optional: Subscribe to user status updates
                client.subscribe(`/topic/user/${user.user.id}/status`, (message: any) => {
                    const statusUpdate = JSON.parse(message.body);
                    console.log('User status update:', statusUpdate);
                    // Handle user status changes (online/offline, typing, etc.)
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

    // Conversation-specific subscription (dành cho MainChat component)
    const subscribeToConversation = useCallback((userId: string, callback: (message: ChatResponse) => void) => {
        if (!stompClientRef.current?.connected) {
            console.warn("WebSocket not connected, cannot subscribe to conversation");
            return () => { };
        }

        const subscriptionKey = `conversation-${userId}`;

        // Unsubscribe existing subscription
        if (conversationSubscriptionsRef.current.has(subscriptionKey)) {
            conversationSubscriptionsRef.current.get(subscriptionKey).unsubscribe();
        }

        // Subscribe to specific conversation
        const subscription = stompClientRef.current.subscribe(
            `/topic/user/${userId}`,
            (message: any) => {
                const receivedMessage: ChatResponse = JSON.parse(message.body);
                callback(receivedMessage);
            }
        );
        console.log("connected to conversation")

        conversationSubscriptionsRef.current.set(subscriptionKey, subscription);

        return () => {
            if (conversationSubscriptionsRef.current.has(subscriptionKey)) {
                conversationSubscriptionsRef.current.get(subscriptionKey).unsubscribe();
                conversationSubscriptionsRef.current.delete(subscriptionKey);
            }
        };
    }, []);

    // ===== Helper: Tạo và cấu hình RTCPeerConnection =====
    const createPeerConnection = async (callType: string) => {
        if (pcRef.current) {
            console.warn("PeerConnection đã tồn tại.");
            return pcRef.current;
        }

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
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
            console.log("Remote track received");
            if (event.streams[0]) {
                if (event.streams[0].getVideoTracks().length > 0 && remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
                if (event.streams[0].getAudioTracks().length > 0 && remoteAudioRef.current) {
                    remoteAudioRef.current.srcObject = event.streams[0];
                }
            }
        };

        pc.onconnectionstatechange = () => {
            console.log("Connection state:", pc.connectionState);
            if (pc.connectionState === "connected") {
                setCallState("CONNECTED");
                setCallStartTime(Date.now());
            }
            if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
                // Dọn dẹp nếu kết nối bị ngắt đột ngột
                hangup();
                // cleanupCall();
            }
        };

        // Lấy stream của người dùng
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: callType === "video"
            });
            localStreamRef.current = localStream;

            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
                localVideoRef.current.muted = true;
                localVideoRef.current.play().catch(() => {});
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
    const callUser = (targetId: string, toName: string, callType: string) => {
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
    const handleIncomingCall = (req: CallRequest) => {
        if (callState !== 'IDLE' && user?.user.id) {
            // Đang bận, tự động từ chối
            const rejectPayload: CallAction = { from: user.user.id, to: req.from };
            stompClientRef.current?.send("/app/call/reject", {}, JSON.stringify(rejectPayload));
            return;
        }
        setIncomingCallData(req);
        targetRef.current = req.from;
        setCallState("INCOMING");
    };

    // ===== 3a. Callee: Chấp nhận cuộc gọi =====
    const acceptCall = async () => {
        if (!incomingCallData || !user?.user.id) return;

        // Gửi tín hiệu chấp nhận
        const payload: CallAccepted = {
            from: user.user.id,
            to: incomingCallData.from,
            toAvatar: user.user.avatarUrl,
            callType: incomingCallData.callType
        };
        stompClientRef.current?.send("/app/call/accept", {}, JSON.stringify(payload));

        // Bây giờ mới tạo PeerConnection để sẵn sàng nhận Offer
        await createPeerConnection(incomingCallData.callType);

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
        setIncomingCallData(null);
        setCallStartTime(null)
        targetRef.current = null;
    };

    // ===== 4. Caller: Xử lý khi callee đã chấp nhận =====
    const handleCallAccepted = async (msg: CallAccepted) => {
        console.log("Call accepted by", msg.from);
        // Callee đã đồng ý, bây giờ caller tạo PC và gửi Offer
        const pc = await createPeerConnection(msg.callType);
        if (!pc || !user?.user.id) {
            // Xử lý lỗi không tạo được PC
            hangup();
            return;
        }

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const payload: OfferAnswer = {
            from: user.user.id,
            to: msg.from,
            sdp: JSON.stringify(pc.localDescription),
            callType: msg.callType
        };
        stompClientRef.current?.send("/app/call/offer", {}, JSON.stringify(payload));
        console.log("Offer sent");
    };

    // ===== 5. Caller: Xử lý khi callee từ chối =====
    const handleCallRejected = () => {
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
                const payload: OfferAnswer = {
                    from: user.user.id,
                    to: msg.from,
                    sdp: JSON.stringify(pc.localDescription),
                    callType: msg.callType
                };
                stompClientRef.current?.send("/app/call/answer", {}, JSON.stringify(payload));
                console.log("Answer sent");
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
        if (targetRef.current && user?.user.id) {
            const durationSec =
                callStartTime ? Math.floor((Date.now() - callStartTime) / 1000) : 0;

            // Gửi payload lưu lịch sử
            const payload = {
                from: user.user.id,
                to: targetRef.current,
                duration: durationSec,
                callType: callType,
                status: durationSec > 0 ? "COMPLETED" : "MISSED",
            };
            stompClientRef.current?.send("/app/call/hangup", {}, JSON.stringify(payload));
        }
        setCallState("IDLE");
        setCallStartTime(null);
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

        // Dừng các track media
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;

        // Reset các ref và state
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
        targetRef.current = null;
        pendingCandidates.current = [];
        setIncomingCallData(null);
        setCallState("IDLE");
    };

    // Clear global messages
    const clearGlobalMessages = useCallback(() => {
        setGlobalMessages([]);
    }, []);

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

            conversationSubscriptionsRef.current.forEach(subscription => {
                subscription.unsubscribe();
            });
            conversationSubscriptionsRef.current.clear();

            if (stompClientRef.current?.connected) {
                stompClientRef.current.disconnect();
            }
        };
    }, [user, connectWebSocket]);

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
            subscribeToConversation,

            callState,
            incomingCallData,

            localVideoRef,
            localStreamRef,

            remoteVideoRef,
            remoteAudioRef,
            targetRef,

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