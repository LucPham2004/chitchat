import { ApiResponse, Page } from "../types/backend";
import { ChatResponse, ChatRequest } from "../types/Message";
import instance from "./Axios-customize";


export const getConversationMessages = async (conversationId: number, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<ChatResponse>>>(
        `/chat-service/messages/get/conversation`,
        { params: { conversationId, pageNum } }
    )).data;
};

export const getUserMessages = async (senderId: number, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<ChatResponse>>>(
        `/chat-service/messages/get`,
        { params: { senderId, pageNum } }
    )).data;
};

export const sendMessage = async (request: ChatRequest) => {
    return (await instance.put<ApiResponse<void>>(
        '/chat-service/messages/send',
        request
    )).data;
};

export const deleteMessage = async (messageId: number): Promise<void> => {
    await instance.delete<ApiResponse<void>>(`/chat-service/messages/delete/${messageId}`);
};

export const updateMessage = async (messageId: number, content: string) => {
    return (await instance.put<ApiResponse<void>>(
        `/chat-service/messages/update`,
        null,
        { params: { messageId, content } }
    )).data;
};
