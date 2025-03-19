import { ApiResponse, Page } from "../types/backend";
import { MediaResponse } from "../types/Media";
import instance from "./Axios-customize";


// Get Medias by Conversation ID
export const getMediasByConversationId = async (conversationId: number, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<MediaResponse>>>(
        `/chat-service/medias/get/conversation`,
        { params: { conversationId, pageNum } }
    )).data;
};