import { ApiResponse } from "../types/backend";
import { ConversationShortResponse, ConversationResponse, ConversationRequest } from "../types/Conversation";
import instance from "./Axios-customize";


// Get Conversations by Owner ID
export const getConversationsByOwnerId = async (userId: number, pageNum: number) => {
    return (await instance.get<ApiResponse<ConversationShortResponse[]>>(
        `/api/conversations/get/owner`,
        { params: { userId, pageNum } }
    )).data;
};

// Get Conversation by ID
export const getConversationById = async (id: number) => {
    return (await instance.get<ApiResponse<ConversationResponse>>(`/api/conversations/get/${id}`)).data;
};

// Create Conversation
export const createConversation = async (request: ConversationRequest) => {
    return (await instance.post<ApiResponse<ConversationResponse>>('/api/conversations/create',request)).data;
};

// Update Conversation
export const updateConversation = async (request: ConversationRequest) => {
    return (await instance.put<ApiResponse<ConversationResponse>>('/api/conversations/update', request)).data;
};

// Delete Conversation by ID
export const deleteConversationById = async (id: number): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/api/conversations/delete/${id}`);
};
