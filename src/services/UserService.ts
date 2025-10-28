import { UserCreationRequest, UserUpdateRequest, UserResponse, UserDTO, UserUpdateImageRequest, UserUpdateLinksRequest } from '../types/User';
import { ApiResponse, Page } from '../types/backend';
import instance from './Axios-customize';

// Create User
export const createUser = async (request: UserCreationRequest) => {
    return (await instance.post<ApiResponse<UserResponse>>('/users/create', request)).data;
};

// Get User by ID
export const getUserById = async (id: string) => {
    return (await instance.get<ApiResponse<UserResponse>>(`/users/get/${id}`)).data;
};

export const getOtherUserById = async (selfId: string, otherId: string) => {
    return (await instance.get<ApiResponse<UserResponse>>(`/users/get`,
        { params: { selfId, otherId } }
    )).data;
};

// Update User
export const updateUser = async (request: UserUpdateRequest) => {
    return (await instance.put<ApiResponse<UserResponse>>('/users/update', request)).data;
};

export const updateUserImages = async (request: UserUpdateImageRequest) => {
    return (await instance.put<ApiResponse<UserResponse>>('/users/update/images', request)).data;
};

export const updateUserLinks = async (request: UserUpdateLinksRequest) => {
    return (await instance.put<ApiResponse<UserResponse>>('/users/update/links', request)).data;
};

// Delete User by ID
export const deleteUserById = async (id: string): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/users/delete/${id}`);
};

// Get All Users
export const getAllUsers = async (page: number = 0, size: number = 20) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/users/get/all', { params: { page, size } })).data;
};

// Search users
export const searchUsers = async (userId: string, name: string, pageNum: number = 0) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/users/search/name', 
        { params: { userId, name, pageNum } })).data;
};

// Get User's Friends
export const getUserFriends = async (userId: string, pageNum: number = 0) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/users/get/friends', { params: { userId, pageNum } })).data;
};

// Get User's Friends
export const getUserFriendRequests = async (userId: string, pageNum: number = 0) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/users/get/friends/request', { params: { userId, pageNum } })).data;
};

// Get Mutual Friends
export const getMutualFriends = async (meId: string, youId: string, pageNum: number = 0) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/users/get/friends/mutual', { params: { meId, youId, pageNum } })).data;
};

// Get Suggested Friends
export const getSuggestedFriends = async (userId: string, pageNum: number = 0) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/users/get/friends/suggested', { params: { userId, pageNum } })).data;
};
