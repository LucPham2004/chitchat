import instance from './Axios-customize';
import { ApiResponse } from '../types/backend';
import { MessageEmojiReaction } from '../types/MessageEmojiReaction';

// Get Message MessageEmojiReaction Count
export const getMessageMessageEmojiReactionCount = async (MessageId: number) => {
    return (await instance.get<ApiResponse<number>>(`/chat-service/message-reactions/get/count/message/${MessageId}`)).data;
};

export const getMessageMessageEmojiReactions = async (messageId: number) => {
    return (await instance.get<ApiResponse<MessageEmojiReaction[]>>(`/chat-service/message-reactions/get/all/${messageId}`)).data;
};

// Create Message MessageEmojiReaction
export const createMessageMessageEmojiReaction = async (userId: number, messageId: number, emoji: string) => {
    return (await instance.post<ApiResponse<MessageEmojiReaction>>(`/chat-service/message-reactions`, null, 
        { params: { userId, messageId, emoji } }
    )).data;
};


// Delete Message MessageEmojiReaction
export const deleteMessageMessageEmojiReaction = async (userId: number, messageId: number) => {
    await instance.delete<ApiResponse<void>>(`/chat-service/message-reactions/remove/user/${userId}/message/${messageId}`);
};

