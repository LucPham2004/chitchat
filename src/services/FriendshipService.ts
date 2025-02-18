import { FriendshipResponse } from '../types/Friendship';
import instance from './Axios-customize';
import { ApiResponse } from '../types/backend';

// Get Friendship Status
export const getFriendStatus = async (requesterId: number, receiverId: number) => {
    return (await instance.get<ApiResponse<FriendshipResponse>>(`/user-service/friendships/${requesterId}/${receiverId}`)).data;
};

// Send Friend Request
export const sendFriendRequest = async (requesterId: number, receiverId: number) => {
    return (await instance.post<ApiResponse<FriendshipResponse>>(`/user-service/friendships/${requesterId}/${receiverId}`, null)).data;
};

// Delete Friendship
export const deleteFriendship = async (id: number) => {
    await instance.delete<ApiResponse<void>>(`/user-service/friendships/${id}`);
};

// Edit Friendship Status
export const editFriendshipStatus = async (id: number, status: string) => {
    return (await instance.put<ApiResponse<FriendshipResponse>>(`/user-service/friendships/${id}/${status}`, null)).data;
};
