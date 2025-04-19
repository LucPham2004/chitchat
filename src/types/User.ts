export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other'
}

export interface UserCreationRequest {
    username: string;
    password: string;
    email?: string | null;
    firstName?: string;
    lastName?: string;
    dob?: string;
    gender?: Gender;
}

export interface UserUpdateRequest {
    id: number;
    firstName?: string;
    lastName?: string;
    dob?: Date;
    gender?: string;
    bio?: string;
    location?: string;
    job?: string;
}

export interface UserUpdateImageRequest {
    id: number;
    avatarPublicId?: string;
    avatarUrl?: string;
    coverPhotoPublicId?: string;
    coverPhotoUrl?: string;
}

export interface UserUpdateLinksRequest {
    id: number;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
    github?: string;
    discord?: string;
}

export interface UserDTO {
    id: number;
    firstName: string;
    lastName?: string;
    location?: string;
    isFriend?: boolean;
    avatarUrl: string;
    friendNum?: number;
    mutualFriendsNum?: number | null;

    conversationId?: number;
}

export interface UserResponse {
    id: number;
    username: string;
    avatarPublicId?: string;
    avatarUrl: string;
    coverPhotoPublicId?: string;
    coverPhotoUrl?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    location?: string;
    bio?: string;
    job?: string;
    authorities: {
         id: string;
         authority: string;
    };
    conversationId: number;
    
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
    github?: string;
    discord?: string;
    
    dob: string;
    createdAt: Date;
    updatedAt: Date;
    gender?: Gender;
    friend: boolean;
    friendNum: number;
    mutualFriendsNum?: number | null;
}

export interface ChatParticipants {
    id: number;
    username: string;
    avatarPublicId: string;
    avatarUrl: string;
    firstName: string;
    lastName: string;
}