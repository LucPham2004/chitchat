import { ApiResponse, Page } from "../types/backend";
import { ConversationShortResponse, ConversationResponse, ConversationRequest } from "../types/Conversation";
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

// Get Conversation by ID
export const getConversationById = async (id: number) => {
    return (await instance.get<ApiResponse<ConversationResponse>>(`/chat-service/conversations/get/${id}`)).data;
};

// Create Conversation
export const createConversation = async (request: ConversationRequest) => {
    return (await instance.post<ApiResponse<ConversationResponse>>('/chat-service/conversations/create',request)).data;
};

// Update Conversation
export const updateConversation = async (request: ConversationRequest) => {
    return (await instance.put<ApiResponse<ConversationResponse>>('/chat-service/conversations/update', request)).data;
};

// Delete Conversation by ID
export const deleteConversationById = async (id: number): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/chat-service/conversations/delete/${id}`);
};
