export interface FriendshipRequest {
    requesterId: number;
    receiverId: number;
}

export interface FriendshipResponse {
    id: number;
    requesterId: number;
    receiverId: number;
    status: string;
}