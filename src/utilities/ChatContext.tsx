import React, { createContext, useContext, useState } from "react";

type LastMessage = {
    conversationId: string;
    senderId: number;
    content: string;
    timestamp: string;
};

type ChatContextType = {
    lastMessages: Record<string, LastMessage>;
    updateLastMessage: (conversationId: string, senderId: number, content: string, timestamp: string) => void;
    displayMediaUrl: string | undefined;
    setDisplayMediaUrl: (url: string | undefined) => void;
    isDisplayMedia: boolean | null;
    setIsDisplayMedia: (open: boolean | null) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider để bọc toàn bộ ứng dụng
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lastMessages, setLastMessages] = useState<Record<string, LastMessage>>({});
    const [displayMediaUrl, setDisplayMediaUrl] = useState<string | undefined>(undefined);
    const [isDisplayMedia, setIsDisplayMedia] = useState<boolean | null>(null);

    const updateLastMessage = (conversationId: string, senderId: number, content: string, timestamp: string) => {
        setLastMessages((prev) => ({
            ...prev,
            [conversationId]: { conversationId, senderId, content, timestamp },
        }));
    };

    return (
        <ChatContext.Provider value={{ 
            lastMessages, updateLastMessage, 
            displayMediaUrl, setDisplayMediaUrl,
            isDisplayMedia, setIsDisplayMedia }}>
            {children}
        </ChatContext.Provider>
    );
};

// Hook để sử dụng Context
export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
};
