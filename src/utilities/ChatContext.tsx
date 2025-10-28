import { Stomp } from "@stomp/stompjs";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { ChatResponse } from "../types/Message";

type LastMessage = {
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: string;
};

// Type payloads tương ứng backend
type CallRequest = { 
    from: string; 
    fromName: string; 
    to: string;
    toName: string;
    callType: string;
};

type OfferAnswer = { from: string; to: string; sdp: string };
type IceCandidateMsg = { from: string; to: string; candidate: string };

const STUN_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" } // test miễn phí
  ]
};


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
    clearGlobalMessages: () => void;

    // Conversation-specific subscriptions (cho MainChat)
    subscribeToConversation: (conversationId: string, callback: (message: ChatResponse) => void) => () => void;

    // Call functions
    incomingCall: CallRequest | null;
    showIncomingCallModal: boolean;
    localVideoRef: any | null;
    remoteStreamRef: any | null;
    callUser: (targetId: string) => void;
    handleIncomingCall: (req: CallRequest) => void;
    acceptCall: (callerId: string, callType: string) => void;
    hangup:() => void;
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
    const [showIncomingCallModal, setShowIncomingCallModal] = useState<boolean>(false);
    const [incomingCall, setIncomingCall] = useState<CallRequest | null>(null);

    // Refs
    const stompClientRef = useRef<any>(null);
    const conversationSubscriptionsRef = useRef<Map<string, any>>(new Map());
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);
    
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<HTMLVideoElement | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const targetRef = useRef<string | null>(null);


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
    const connectWebSocket = useCallback(() => {
        if (!user) return;

        // Cleanup existing connection
        if (stompClientRef.current?.connected) {
            console.log("Disconnecting existing WebSocket...");
            stompClientRef.current.disconnect();
        }

        const client = Stomp.client("ws://localhost:8888/ws");
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

                    // phân loại theo payload shape
                    if ((data as any).sdp && (data as any).from && (data as any).to) {
                        const sdp = data.sdp;
                        // quyết định offer hoặc answer dựa vào sdp.type có thể decode?
                        // chúng ta xử lý ở chỗ gửi: client sẽ biết gửi loại nào.
                        handleRemoteSDP(data as OfferAnswer);
                    } else if ((data as any).candidate) {
                        handleRemoteIce(data as IceCandidateMsg);
                    } else if ((data as any).to && (data as any).from) {
                        // có thể là CallRequest: kiểm tra if có property đặc biệt?
                        // backend gửi cùng object CallRequest -> hiển thị incoming call
                        handleIncomingCall(data as CallRequest);
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
    const subscribeToConversation = useCallback((conversationId: string, callback: (message: ChatResponse) => void) => {
        if (!stompClientRef.current?.connected) {
            console.warn("WebSocket not connected, cannot subscribe to conversation");
            return () => { };
        }

        const subscriptionKey = `conversation-${conversationId}`;

        // Unsubscribe existing subscription
        if (conversationSubscriptionsRef.current.has(subscriptionKey)) {
            conversationSubscriptionsRef.current.get(subscriptionKey).unsubscribe();
        }

        // Subscribe to specific conversation
        const subscription = stompClientRef.current.subscribe(
            `/topic/user/${conversationId}`,
            (message: any) => {
                const receivedMessage: ChatResponse = JSON.parse(message.body);
                callback(receivedMessage);
            }
        );

        conversationSubscriptionsRef.current.set(subscriptionKey, subscription);

        return () => {
            if (conversationSubscriptionsRef.current.has(subscriptionKey)) {
                conversationSubscriptionsRef.current.get(subscriptionKey).unsubscribe();
                conversationSubscriptionsRef.current.delete(subscriptionKey);
            }
        };
    }, []);

    // ===== helper create RTCPeerConnection
    const createPeerConnection = async (isCaller: boolean) => {
        const pc = new RTCPeerConnection(STUN_SERVERS);

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

        pc.ontrack = (ev) => {
            console.log("Remote track", ev.streams);
            if (remoteStreamRef.current) {
                // gán lần đầu
                if (ev.streams && ev.streams[0]) {
                    remoteStreamRef.current.srcObject = ev.streams[0];
                } else {
                    // fallback: tạo mediaStream từ tracks
                    const ms = new MediaStream();
                    ev.streams?.forEach(s => s.getTracks().forEach(t => ms.addTrack(t)));
                    remoteStreamRef.current!.srcObject = ms;
                }
            }
        };

        // get local stream
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localStreamRef.current = localStream;
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        // show local stream
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        pcRef.current = pc;
        return pc;
    };

    // ===== call someone (caller flow)
    const callUser = async (targetId: string) => {
        if(!user) return;
        targetRef.current = targetId;
        const pc = await createPeerConnection(true);

        // create offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const payload: OfferAnswer = {
        from: user.user.id,
        to: targetId,
        sdp: JSON.stringify(pc.localDescription)
        };
        stompClientRef.current?.send("/app/call/offer", {}, JSON.stringify(payload));
        console.log("Offer sent");
    };

    // ===== handle incoming call request (server forwarded CallRequest)
    const handleIncomingCall = (req: CallRequest) => {
        console.log("Incoming call from", req.from);

        // acceptCall(req.from);
        setShowIncomingCallModal(true);
    };

    // ===== accept call (callee flow)
    const acceptCall = async (callerId: string, callType: string) => {
        targetRef.current = callerId;
        const pc = await createPeerConnection(false);
        // cua B (callee) sẽ chờ receive offer (server đã gửi offer từ caller). Khi handleRemoteSDP bắt được offer, sẽ tạo answer.
        console.log("Accepted call; waiting for offer...");
    };

    // ===== hangup
    const hangup = () => {
        pcRef.current?.close();
        pcRef.current = null;
        localStreamRef.current?.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
        targetRef.current = null;
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteStreamRef.current) remoteStreamRef.current.srcObject = null;
    };

    // ===== handle remote SDP (offer or answer)
    const handleRemoteSDP = async (msg: OfferAnswer) => {
        if (!user) return;
        if (!pcRef.current) {
            // nếu chưa có pc (callee hasn't accepted), tạo
            await createPeerConnection(false);
        }
        const pc = pcRef.current!;
        const sdpObj = JSON.parse(msg.sdp) as RTCSessionDescriptionInit;

        if (sdpObj.type === "offer") {
            // callee nhận offer -> setRemote + createAnswer
            await pc.setRemoteDescription(sdpObj);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            const payload: OfferAnswer = { from: user?.user.id, to: msg.from, sdp: JSON.stringify(pc.localDescription) };
            stompClientRef.current?.send("/app/call/answer", {}, JSON.stringify(payload));
            console.log("Answer sent");
        } else if (sdpObj.type === "answer") {
            // caller nhận answer
            await pc.setRemoteDescription(sdpObj);
            console.log("Set remote answer");
        }
    };

    // ===== handle remote ICE
    const handleRemoteIce = async (msg: IceCandidateMsg) => {
        if (!pcRef.current) {
            console.warn("No pc to add ice candidate yet");
            return;
        }
        try {
            const candidateObj = JSON.parse(msg.candidate);
            await pcRef.current.addIceCandidate(candidateObj);
            console.log("Added remote ICE candidate");
        } catch (e) {
            console.error("Error adding ice", e);
        }
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
            clearGlobalMessages,
            subscribeToConversation,
            incomingCall,
            showIncomingCallModal,
            localVideoRef,
            remoteStreamRef,
            callUser,
            handleIncomingCall,
            acceptCall,
            hangup
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