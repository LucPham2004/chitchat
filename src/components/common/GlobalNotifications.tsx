import { useState, useEffect } from "react";
import { useChatContext } from "../../utilities/ChatContext";
import { ChatResponse } from "../../types/Message";


export const GlobalNotifications = () => {
    const { globalMessages, clearGlobalMessages, isConnected } = useChatContext();
    const [showToast, setShowToast] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<ChatResponse | null>(null);

    useEffect(() => {
        if (globalMessages.length > 0) {
            const latestMessage = globalMessages[globalMessages.length - 1];
            if (latestMessage.type === 'message') {
                setCurrentMessage(latestMessage);
                setShowToast(true);
                
                // Auto hide after 5 seconds
                setTimeout(() => setShowToast(false), 5000);
            }
        }
    }, [globalMessages]);

    if (!showToast || !currentMessage) return null;

    return (
        <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {currentMessage.senderName?.[0] || '?'}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">New message</p>
                    <p className="text-gray-600 dark:text-gray-300 text-xs truncate">
                        {currentMessage.content || 'Sent you a file'}
                    </p>
                </div>
                <button 
                    onClick={() => setShowToast(false)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    ×
                </button>
            </div>
        </div>
    );
};