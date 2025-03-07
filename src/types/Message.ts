export interface PinnedMessage {
    senderId: number;
    user: string;
    name: string;
    avatarUrl: string;
    message: string;
    timestamp: string;
}


export interface ChatRequest {
    id: number;
    conversationId: number;
    senderId: number;
    recipientId: number[];
    content: string;
    url: string;
}

export interface ChatResponse {
    id: number;
    conversationId: number;
    senderId: number;
    recipientId: number[];
    content: string;
    url: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}