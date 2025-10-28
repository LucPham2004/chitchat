export interface FriendshipRequest {
    requesterId: string;
    receiverId: string;
}

export interface FriendshipResponse {
    id: number;
    requesterId: string;
    receiverId: string;
    status: string;
}