import { FriendshipResponse } from '../types/Friendship';
import instance from './Axios-customize';
import { ApiResponse } from '../types/backend';

// Get Friendship Status
export const getFriendStatus = async (senderId: number, recipientId: number) => {
    return (await instance.get<ApiResponse<FriendshipResponse>>('/user-service/friendships/get/status', { params: { senderId, recipientId } })).data;
};

// Send Friend Request
export const sendFriendRequest = async (senderId: number, recipientId: number) => {
    return (await instance.post<ApiResponse<FriendshipResponse>>('/user-service/friendships/request', null, 
        { params: { senderId, recipientId } })).data;
};

// Delete Friendship
export const deleteFriendship = async (senderId: number, recipientId: number) => {
    await instance.delete<ApiResponse<void>>('/user-service/friendships/delete', { params: { senderId, recipientId } });
};

// Edit Friendship Status
export const editFriendshipStatus = async (senderId: number, recipientId: number, status: string) => {
    return (await instance.put<ApiResponse<FriendshipResponse>>('/user-service/friendships/update', null, 
        { params: { senderId, recipientId, status } })).data;
};
