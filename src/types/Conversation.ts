

export interface Conversation {
	id: number;
	name: string;
	lastMessage: string;
	avatarUrl: string;
	time: string;
}

export interface ConversationResponse {
	id: number;
	name: string;
	avatarUrl?: string;
	description?: string;
	color?: string;
	emoji?: string;
	lastMessage: string;
	lastMessageTime: string;

	ownerId: number;
	participantIds: number[];

	isGroup?: boolean;
	isRead?: boolean;
	isMuted?: boolean;
	isPinned?: boolean;
	isArchived?: boolean;
	isDeleted?: boolean;
	isBlocked?: boolean;
	isReported?: boolean;
	isSpam?: boolean;
	isMarkedAsUnread?: boolean;
	isMarkedAsRead?: boolean;
};

export interface ConversationShortResponse {
	id: number;
	name: string;
	avatarUrl?: string;
	lastMessage: string;
	lastMessageTime: string;
	ownerId: number;
	participantIds?: number[];
	isGroup?: boolean;
	isRead?: boolean;
};

export interface ConversationRequest {
	id: number;
	name: string;
	avatarUrl?: string;
	description?: string;
	color?: string;
	emoji?: string;
	lastMessage: string;
  
	participantIds: number[];
	ownerId: number;

	isGroup?: boolean;
	isRead?: boolean;
	isMuted?: boolean;
	isPinned?: boolean;
	isArchived?: boolean;
	isDeleted?: boolean;
	isBlocked?: boolean;
	isReported?: boolean;
	isSpam?: boolean;
	isMarkedAsUnread?: boolean;
	isMarkedAsRead?: boolean;
  }
