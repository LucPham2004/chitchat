# User Online/Offline Status & Typing Indicator - Implementation Guide

## Overview
This implementation adds real-time user online/offline status and typing indicators to the ChitChat application using WebSocket subscriptions.

## Components Created

### 1. **UserStatus.ts** - Types Definition
Location: `src/types/UserStatus.ts`

Defines the following types:
- `UserOnlineStatus`: 'online' | 'offline'
- `UserStatusUpdate`: Information about a user's online status
- `UserTypingStatus`: Information about a user's typing status
- `UserStatusDisplay`: Combined display data for a user's status

### 2. **UserStatusBadge.tsx** - Status Display Component
Location: `src/components/common/UserStatusBadge.tsx`

Displays a colored dot badge indicating user status:
- Green dot: User is online
- Gray dot: User is offline
- Shows optional text label ("Active now" / "Inactive")
- Supports three sizes: small, medium, large

**Usage:**
```tsx
import UserStatusBadge from "./UserStatusBadge";

<UserStatusBadge 
  userStatus={userStatus} 
  showText={true} 
  size="medium" 
/>
```

### 3. **TypingIndicator.tsx** - Typing Indicator Component
Location: `src/components/common/TypingIndicator.tsx`

Displays an animated typing indicator showing who is typing:
- Shows user name with animated dots
- Theme-aware styling (dark/light mode)
- Animation matches messaging app conventions

**Usage:**
```tsx
import TypingIndicator from "./TypingIndicator";

<TypingIndicator 
  userName="John Doe" 
  show={isTyping} 
/>
```

## ChatContext Updates

Enhanced `ChatContext.tsx` with the following additions:

### New State
```tsx
const [userStatusMap, setUserStatusMap] = useState<Record<string, UserStatusDisplay>>({});
const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
```

### New Functions

#### `sendTypingStatus(conversationId, isTyping)`
Sends typing status to the server via WebSocket.
- Called when user starts typing
- Automatically stops after 1 second of inactivity
- Called explicitly when message is sent

#### `getUserStatus(userId)`
Retrieves cached user status from the map.

### WebSocket Subscriptions

#### Status Subscription: `/topic/user/{userId}/status`
Receives user online/offline status updates:
```json
{
  "userId": "user-id",
  "status": "online" | "offline",
  "timestamp": "ISO-8601-timestamp"
}
```

#### Typing Subscription: `/topic/user/{userId}/typing`
Receives typing status updates:
```json
{
  "userId": "user-id",
  "conversationId": "conv-id",
  "isTyping": boolean,
  "timestamp": "ISO-8601-timestamp"
}
```

## Integration Points

### 1. ChatHeader Component
- Displays online/offline status for one-on-one chats
- Shows status badge next to user name
- Updates in real-time based on WebSocket messages

### 2. ChatBody Component
- Displays typing indicator when other participant(s) are typing
- Shows below message list
- Auto-hides when typing stops
- Shows participant name who is typing

### 3. ChatInput Component
- Sends typing status when user starts typing
- Debounced to prevent excessive messages (1 second timeout)
- Sends typing stopped when message is sent
- Sends typing stopped when input is cleared

## Backend Requirements

The backend should implement the following endpoints:

### 1. Send Typing Status
```
POST /app/user/typing
Body: UserTypingStatus
```

### 2. Send User Status
```
POST /app/user/status
Body: UserStatusUpdate
```

### 3. WebSocket Subscriptions
- `/topic/user/{userId}/status` - Broadcast user status changes
- `/topic/user/{userId}/typing` - Broadcast typing status

## Usage Example

### In a Chat View
```tsx
import { useChatContext } from "../utilities/ChatContext";
import UserStatusBadge from "./common/UserStatusBadge";
import TypingIndicator from "./common/TypingIndicator";

const ChatHeader = () => {
  const { getUserStatus } = useChatContext();
  const userStatus = getUserStatus(userId);

  return (
    <div>
      <h2>{userName}</h2>
      <UserStatusBadge userStatus={userStatus} showText={true} />
    </div>
  );
};

const ChatBody = () => {
  const { getUserStatus } = useChatContext();
  
  return (
    <div>
      {messages.map(msg => <ChatMessage {...msg} />)}
      
      {getUserStatus(otherUserId)?.isTyping && (
        <TypingIndicator 
          userName={participantName} 
          show={true} 
        />
      )}
    </div>
  );
};
```

## Key Features

✅ Real-time online/offline status
✅ Real-time typing indicators
✅ Automatic timeout for typing status (3 seconds inactivity)
✅ Debounced typing messages (1 second)
✅ Theme-aware components
✅ Supports both one-on-one and group chats
✅ Automatic cleanup on disconnect

## Customization

### Typing Timeout
Change the timeout in `ChatContext.tsx` line ~320:
```tsx
typingTimeoutRef.current[typingStatus.userId] = setTimeout(() => {
  // Modify timeout duration here (currently 3000ms)
}, 3000);
```

### Debounce Duration
Change the debounce in `ChatInput.tsx`:
```tsx
typingTimeoutRef.current = setTimeout(() => {
  sendTypingStatus(conv_id, false);
}, 1000); // Change this value
```

### Status Badge Appearance
Edit `UserStatusBadge.tsx` to customize colors and sizes.

### Typing Indicator Animation
Edit `TypingIndicator.tsx` to change animation style and duration.

## Troubleshooting

### Status not updating?
1. Verify WebSocket connection is established
2. Check browser console for subscription errors
3. Ensure backend is sending status updates
4. Check that user IDs match between client and server

### Typing indicator stuck?
1. Verify typing stop messages are being sent
2. Check the 3-second timeout is working
3. Try refreshing the page
4. Check network tab for WebSocket issues

## Future Enhancements

- Add last seen timestamp display
- Show "is recording" status
- Multi-user typing indicators (show all users typing)
- Persistence of user status (localStorage)
- User away/idle status detection
- Read receipts
