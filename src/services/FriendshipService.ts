import { FriendshipResponse } from '../types/Friendship';
import instance from './Axios-customize';
import { ApiResponse } from '../types/backend';

// Get Friendship Status
export const getFriendStatus = async (senderId: string, recipientId: string) => {
    return (await instance.get<ApiResponse<FriendshipResponse>>('/friendships/get/status', { params: { senderId, recipientId } })).data;
};

// Send Friend Request
export const sendFriendRequest = async (senderId: string, recipientId: string) => {
    return (await instance.post<ApiResponse<FriendshipResponse>>('/friendships/request', null, 
        { params: { senderId, recipientId } })).data;
};

// Delete Friendship
export const deleteFriendship = async (senderId: string, recipientId: string) => {
    await instance.delete<ApiResponse<void>>('/friendships/delete', { params: { senderId, recipientId } });
};

// Edit Friendship Status
export const editFriendshipStatus = async (senderId: string, recipientId: string, status: string) => {
    return (await instance.put<ApiResponse<FriendshipResponse>>('/friendships/update', null, 
        { params: { senderId, recipientId, status } })).data;
};

// Block User
export const blockUser = async (blockerId: string, blockedUserId: string) => {
    return (await instance.put<ApiResponse<FriendshipResponse>>('/friendships/block', null, 
        { params: { blockerId, blockedUserId } })).data;
};

// Unblock User
export const unblockUser = async (blockerId: string, blockedUserId: string) => {
    return (await instance.put<ApiResponse<FriendshipResponse>>('/friendships/unblock', null, 
        { params: { blockerId, blockedUserId } })).data;
};
