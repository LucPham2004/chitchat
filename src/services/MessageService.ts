import { ApiResponse, Page } from "../types/backend";
import { ChatResponse, ChatRequest } from "../types/Message";
import instance from "./Axios-customize";


export const getConversationMessages = async (conversationId: string, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<ChatResponse>>>(
        `/messages/get/conversation`,
        { params: { conversationId, pageNum } }
    )).data;
};

export const getUserMessages = async (senderId: string, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<ChatResponse>>>(
        `/messages/get/user`,
        { params: { senderId, pageNum } }
    )).data;
};

export const searchMessages = async (conversationId: string, keyword: string, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<ChatResponse>>>(
        `/messages/search`,
        { params: { conversationId, keyword, pageNum } }
    )).data;
};

export const sendMessage = async (request: ChatRequest) => {
    return (await instance.put<ApiResponse<void>>(
        '/messages/send',
        request
    )).data;
};

export const deleteMessage = async (messageId: string): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/messages/delete/${messageId}`);
};

export const updateMessage = async (messageId: string, content: string) => {
    return (await instance.put<ApiResponse<void>>(
        `/messages/update`,
        null,
        { params: { messageId, content } }
    )).data;
};
