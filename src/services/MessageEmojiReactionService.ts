import instance from './Axios-customize';
import { ApiResponse } from '../types/backend';
import { MessageEmojiReaction } from '../types/MessageEmojiReaction';

// Get Message MessageEmojiReaction Count
export const getMessageMessageEmojiReactionCount = async (MessageId: string) => {
    return (await instance.get<ApiResponse<string>>(`/message-reactions/get/count/message/${MessageId}`)).data;
};

export const getMessageMessageEmojiReactions = async (messageId: string) => {
    return (await instance.get<ApiResponse<MessageEmojiReaction[]>>(`/message-reactions/get/all/${messageId}`)).data;
};

// Create Message MessageEmojiReaction
export const createMessageMessageEmojiReaction = async (userId: string, messageId: string, emoji: string) => {
    return (await instance.post<ApiResponse<MessageEmojiReaction>>(`/message-reactions`, null, 
        { params: { userId, messageId, emoji } }
    )).data;
};


// Delete Message MessageEmojiReaction
export const deleteMessageMessageEmojiReaction = async (userId: string, messageId: string) => {
    return (await instance.delete<ApiResponse<void>>(`/message-reactions/remove/user/${userId}/message/${messageId}`)).data;
};

