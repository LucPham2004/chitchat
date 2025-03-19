

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
	avatarUrls?: string[];
	description?: string;
	color?: string;
	emoji?: string;
	lastMessage: {
		id: number;
		conversationId: number;
		senderId: number;
		recipientId: number[];
		content: string;
		publicIds: string[];
		urls: string[];
		isRead: boolean;
		createdAt: string;
		updatedAt: string;
	}
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
	avatarUrls?: string[];
	lastMessage: {
		id: number;
		conversationId: number;
		senderId: number;
		recipientId: number[];
		content: string;
		publicIds: string[];
		urls: string[];
		isRead: boolean;
		createdAt: string;
		updatedAt: string;
	}
	ownerId: number;
	participantIds?: number[];
	isGroup?: boolean;
	isRead?: boolean;
};

export interface ConversationRequest {
	id?: number;
	name?: string;
	avatarUrls?: string;
	description?: string;
	color?: string;
	emoji?: string;
  
	participantIds?: number[];
	ownerId?: number;

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
