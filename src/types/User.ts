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
    id: string;
    firstName?: string;
    lastName?: string;
    dob?: Date;
    gender?: string;
    bio?: string;
    location?: string;
    job?: string;
}

export interface UserUpdateImageRequest {
    id: string;
    avatarPublicId?: string;
    avatarUrl?: string;
    coverPhotoPublicId?: string;
    coverPhotoUrl?: string;
}

export interface UserUpdateLinksRequest {
    id: string;
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
    id: string;
    firstName: string;
    lastName?: string;
    location?: string;
    isFriend?: boolean;
    avatarUrl: string;
    friendNum?: number;
    mutualFriendsNum?: number | null;

    conversationId?: string;
}

export interface UserResponse {
    id: string;
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
    conversationId: string;
    
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
    id: string;
    username: string;
    avatarPublicId: string;
    avatarUrl: string;
    firstName: string;
    lastName: string;
}