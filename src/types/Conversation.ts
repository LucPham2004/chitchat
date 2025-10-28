

export interface Conversation {
	id: string;
	name: string;
	lastMessage: string;
	avatarUrl: string;
	time: string;
}

export interface ConversationResponse {
	id: string;
	name: string;
	avatarUrls?: string[];
	description?: string;
	color?: string;
	emoji?: string;
	lastMessage: {
		id: string;
		conversationId: string;
		senderId: string;
		recipientId: string[];
		content: string;
		publicIds: string[];
		urls: string[];
		isRead: boolean;
		createdAt: string;
		updatedAt: string;
	}
	ownerId: string;
	participantIds: string[];

	group?: boolean;
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
	id: string;
	name: string;
	avatarUrls?: string[];
	lastMessage: {
		id: string;
		conversationId: string;
		senderId: string;
		recipientId: string[];
		content: string;
		publicIds: string[];
		urls: string[];
		isRead: boolean;
		createdAt: string;
		updatedAt: string;
	}
	ownerId: string;
	participantIds?: string[];
	group?: boolean;
	isRead?: boolean;
};

export interface ConversationRequest {
	id?: string;
	name?: string;
	avatarUrls?: string;
	description?: string;
	color?: string;
	emoji?: string;
  
	participantIds?: string[];
	ownerId?: string;

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
