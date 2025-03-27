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

    publicIds: string[];
    urls: string[];
    fileNames: string[];
    heights: number[];
    widths: number[];
    resourceTypes: string[];
}

export interface ChatResponse {
    id: number;
    conversationId: number;
    senderId: number;
    recipientId: number[];
    content: string;

    publicIds: string[];
    urls: string[];
    fileNames: string[];
    heights: number[];
    widths: number[];
    resourceTypes: string[];

    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}