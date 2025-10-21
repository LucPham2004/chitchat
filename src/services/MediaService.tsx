import { ApiResponse, Page } from "../types/backend";
import { MediaResponse } from "../types/Media";
import instance from "./Axios-customize";


// Get Medias by Conversation ID
export const getMediasByConversationId = async (conversationId: number, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<MediaResponse>>>(
        `/medias/get/conversation/media`,
        { params: { conversationId, pageNum } }
    )).data;
};

export const getRawFilesByConversationId = async (conversationId: number, pageNum: number) => {
    return (await instance.get<ApiResponse<Page<MediaResponse>>>(
        `/medias/get/conversation/raw`,
        { params: { conversationId, pageNum } }
    )).data;
};