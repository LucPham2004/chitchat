
export interface UserTypingStatus {
    userId: string;
    conversationId: string;
    typing: boolean;
    timestamp: string;
}

export interface UserTypingDisplay {
    userId: string;
    isTyping: boolean;
}
