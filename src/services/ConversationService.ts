import { ApiResponse, Page } from "../types/backend";
import { ConversationShortResponse, ConversationResponse, ConversationRequest } from "../types/Conversation";
import { ChatParticipants } from "../types/User";
import instance from "./Axios-customize";

// Get Joined Conversations by user ID
export const getJoinedConversationsById = async (userId: number, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<ConversationShortResponse>>>(
        `/chat-service/conversations/get/joined`,
        { params: { userId, pageNum } }
    )).data;
};

// Get Conversations by Owner ID
export const getConversationsByOwnerId = async (userId: number, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<ConversationShortResponse>>>(
        `/chat-service/conversations/get/owned`,
        { params: { userId, pageNum } }
    )).data;
};

// Search Conversation
export const searchConversations = async (keyword: string, userId: number, pageNum: number) => {
    return (await instance.get<ApiResponse<ConversationResponse[]>>('/chat-service/conversations/search', 
        { params: { keyword, userId, pageNum } }
    )).data;
};

// Get Conversation by ID
export const getConversationById = async (convId: number, userId: number) => {
    return (await instance.get<ApiResponse<ConversationResponse>>(`/chat-service/conversations/get/${convId}/${userId}`)).data;
};

export const getParticipantsByConvId = async (convId: number) => {
    return (await instance.get<ApiResponse<ChatParticipants[]>>(
        `/chat-service/conversations/get/participants/${convId}`)).data;
};

// Create Conversation
export const createConversation = async (request: ConversationRequest) => {
    return (await instance.post<ApiResponse<ConversationResponse>>('/chat-service/conversations/create',request)).data;
};

// Update Conversation
export const updateConversation = async (request: ConversationRequest, userId: number) => {
    return (await instance.put<ApiResponse<ConversationResponse>>(`/chat-service/conversations/update/${userId}`, request)).data;
};

export const updateConversationPartially = async (request: ConversationRequest, conv_id: number, userId: number) => {
    return (await instance.patch<ApiResponse<ConversationResponse>>(`/chat-service/conversations/update/partially/${conv_id}/${userId}`, request)).data;
};

// Delete Conversation by ID
export const deleteConversationById = async (id: number): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/chat-service/conversations/delete/${id}`);
};
