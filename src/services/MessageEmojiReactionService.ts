import instance from './Axios-customize';
import { ApiResponse } from '../types/backend';
import { MessageEmojiReaction } from '../types/MessageEmojiReaction';

// Get Message MessageEmojiReaction Count
export const getMessageMessageEmojiReactionCount = async (MessageId: number) => {
    return (await instance.get<ApiResponse<number>>(`/api/message-reactions/get/count/message/${MessageId}`)).data;
};


// Create Message MessageEmojiReaction
export const createMessageMessageEmojiReaction = async (userId: number, MessageId: number) => {
    return (await instance.post<ApiResponse<MessageEmojiReaction>>(`/api/message-reactions/create/user/${userId}/message/${MessageId}`, null)).data;
};


// Delete Message MessageEmojiReaction
export const deleteMessageMessageEmojiReaction = async (userId: number, MessageId: number) => {
    await instance.delete<ApiResponse<void>>(`/api/message-reactions/remove/user/${userId}/message/${MessageId}`);
};

