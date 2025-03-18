import { UserCreationRequest, UserUpdateRequest, UserResponse, UserDTO, UserImageUpdateReq } from '../types/User';
import { ApiResponse, Page } from '../types/backend';
import instance from './Axios-customize';

// Create User
export const createUser = async (request: UserCreationRequest) => {
    return (await instance.post<ApiResponse<UserResponse>>('/user-service/users/create', request)).data;
};

// Get User by ID
export const getUserById = async (id: number) => {
    return (await instance.get<ApiResponse<UserResponse>>(`/user-service/users/get/${id}`)).data;
};

// Update User
export const updateUser = async (request: UserUpdateRequest) => {
    return (await instance.put<ApiResponse<UserResponse>>('/user-service/users/update', request)).data;
};

export const updateUserImages = async (request: UserImageUpdateReq) => {
    return (await instance.put<ApiResponse<UserResponse>>('/user-service/users/update/images', request)).data;
};

// Delete User by ID
export const deleteUserById = async (id: number): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/user-service/users/delete/${id}`);
};

// Get All Users
export const getAllUsers = async (page: number = 0, size: number = 20) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/user-service/users/get/all', { params: { page, size } })).data;
};

// // Get Group Members
// export const getGroupMembers = async (groupId: number, pageNum: number = 0) => {
//     return (await instance.get<ApiResponse<Page<UserDTO>>>('/user-service/users/get/group/members', { params: { groupId, pageNum } })).data;
// };

// // Get Group Admins
// export const getGroupAdmins = async (groupId: number, pageNum: number = 0) => {
//     return (await instance.get<ApiResponse<Page<UserDTO>>>('/user-service/users/get/group/admins', { params: { groupId, pageNum } })).data;
// };

// Get User's Friends
export const getUserFriends = async (userId: number, pageNum: number = 0) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/user-service/users/get/friends', { params: { userId, pageNum } })).data;
};

// Get Mutual Friends
export const getMutualFriends = async (meId: number, youId: number, pageNum: number = 0) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/user-service/users/get/mutualFriends', { params: { meId, youId, pageNum } })).data;
};

// Get Suggested Friends
export const getSuggestedFriends = async (userId: number, pageNum: number = 0) => {
    return (await instance.get<ApiResponse<Page<UserDTO>>>('/user-service/users/get/friends/suggested', { params: { userId, pageNum } })).data;
};
