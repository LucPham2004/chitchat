import { MessageEmojiReaction } from "./MessageEmojiReaction";

export interface PinnedMessage {
    senderId: string;
    user: string;
    name: string;
    avatarUrl: string;
    message: string;
    timestamp: string;
}


export interface ChatRequest {
    id: string;
    conversationId: string;
    senderId: string;
    recipientId: string[];
    content: string;
    
    reactions: MessageEmojiReaction[];

    publicIds: string[];
    urls: string[];
    fileNames: string[];
    heights: number[];
    widths: number[];
    resourceTypes: string[];
}

export interface ChatResponse {
    id: string;
    conversationId: string;
    senderId: string;
    recipientId: string[];

    senderName: string;
    content: string;

    reactions: MessageEmojiReaction[];

    publicIds: string[];
    urls: string[];
    fileNames: string[];
    heights: number[];
    widths: number[];
    resourceTypes: string[];

    isRead: boolean;
    createdAt: string;
    updatedAt: string;

    type?: 'message' | 'CALL_REQUEST' | 'CALL_ACCEPT' | 'CALL_REJECT' | 'CALL_END';
    callType?: 'video' | 'audio';
}