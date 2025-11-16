# Visual Integration Guide - Online Status & Typing Indicators

## Component Architecture

```
ChatContext (utilities/ChatContext.tsx)
├── WebSocket Subscriptions
│   ├── /topic/user/{userId}/status
│   └── /topic/user/{userId}/typing
├── State
│   └── userStatusMap: Record<string, UserStatusDisplay>
└── Functions
    ├── sendTypingStatus(conversationId, isTyping)
    └── getUserStatus(userId)
         │
         ├─→ ChatHeader (mainchat/ChatHeader.tsx)
         │   └── Displays UserStatusBadge
         │       └── Shows online/offline indicator
         │
         ├─→ ChatBody (mainchat/ChatBody.tsx)
         │   └── Displays TypingIndicator
         │       └── Shows "User is typing..."
         │
         └─→ ChatInput (mainchat/ChatInput.tsx)
             ├── handleMessageChange()
             │   └── Calls sendTypingStatus(convId, true)
             └── onKeyDown() (on Enter)
                 └── Calls sendTypingStatus(convId, false)
```

## UI Layout

### Chat Header
```
┌─────────────────────────────────────────────────────┐
│ ⬅️ [Back]  👤 User Name          🔔 📞 📹 ≡        │
│         🟢 Active now                                 │
│         ↑ UserStatusBadge                             │
└─────────────────────────────────────────────────────┘
```

### Chat Body (Messages Area)
```
┌─────────────────────────────────────────────────────┐
│ [Message 1 from User A]                             │
│ [Message 2 from User B]                             │
│ [Message 3 from User A]                             │
│                                                      │
│ User B is typing ⚫⚫⚫                                │
│ ↑ TypingIndicator                                   │
└─────────────────────────────────────────────────────┘
```

### Chat Input
```
┌─────────────────────────────────────────────────────┐
│ [📎]  [🎤 User is typing...]  [😊] [💬]             │
│        ↑ Typing indicator shows in tooltip or below│
└─────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Online/Offline Status Flow
```
Backend                       WebSocket                 Frontend
   |                             |                         |
   | Sends status update         |                         |
   |-----(UserStatusUpdate)------|--→  /topic/user/{id}   |
   |                             |      /status            |
   |                             |                    ChatContext
   |                             |                    setUserStatusMap()
   |                             |                         |
   |                             |                    ChatHeader
   |                             |                    renders Badge
   |                             |                         |
   |                             |          UserStatusBadge
   |                             |              (green dot)
```

### Typing Status Flow
```
Frontend (Typing)              WebSocket                Backend
   |                             |                        |
ChatInput                        |                        |
handleMessageChange()            |                        |
   |                             |                        |
sendTypingStatus(true)           |                        |
   |                             |                        |
   |-----(UserTypingStatus)------|--→  /app/user/typing   |
   |   (isTyping: true)          |                        |
   |                             |                        |
   | [pause 1 second]            |                        |
   |                             |                        |
sendTypingStatus(false)          |                        |
   |                             |                        |
   |-----(UserTypingStatus)------|--→  /app/user/typing   |
   |   (isTyping: false)         |                        |
   |                             |                        |
   | Broadcast to all            |                        |
   | participants                |                        |
   |← - - - - - - - - - - - - - -|← (UserTypingStatus)   |
   |                             |   /topic/user/{id}     |
   |                             |   /typing              |
ChatContext                      |                        |
setUserStatusMap()               |                        |
   |                             |                        |
ChatBody                         |                        |
renders TypingIndicator          |                        |
   |                             |                        |
TypingIndicator                  |                        |
(animated dots)                  |                        |
```

## File Structure

```
src/
├── types/
│   ├── UserStatus.ts (NEW)
│   │   ├── UserOnlineStatus
│   │   ├── UserStatusUpdate
│   │   ├── UserTypingStatus
│   │   └── UserStatusDisplay
│   └── ...
│
├── components/
│   ├── common/
│   │   ├── UserStatusBadge.tsx (NEW)
│   │   │   └── Shows online/offline indicator
│   │   ├── TypingIndicator.tsx (NEW)
│   │   │   └── Shows typing animation
│   │   └── ...
│   │
│   ├── chatview/
│   │   └── chat-info/
│   │       └── mainchat/
│   │           ├── ChatHeader.tsx (MODIFIED)
│   │           │   └── Uses UserStatusBadge
│   │           ├── ChatBody.tsx (MODIFIED)
│   │           │   └── Uses TypingIndicator
│   │           ├── ChatInput.tsx (MODIFIED)
│   │           │   └── Sends typing status
│   │           └── MainChat.tsx
│   └── ...
│
└── utilities/
    ├── ChatContext.tsx (MODIFIED)
    │   ├── userStatusMap state
    │   ├── sendTypingStatus()
    │   ├── getUserStatus()
    │   └── WebSocket subscriptions
    └── ...
```

## State Management

### userStatusMap Structure
```typescript
{
  "user-123": {
    userId: "user-123",
    onlineStatus: "online",
    isTyping: false,
    lastSeen: "2025-11-16T10:30:00Z"
  },
  "user-456": {
    userId: "user-456",
    onlineStatus: "offline",
    isTyping: false,
    lastSeen: "2025-11-16T09:15:00Z"
  },
  "user-789": {
    userId: "user-789",
    onlineStatus: "online",
    isTyping: true,
    lastSeen: "2025-11-16T10:31:00Z"
  }
}
```

## Lifecycle Diagram

### User Opens Chat
```
1. ChatContext connects WebSocket
   ↓
2. Subscribe to /topic/user/{userId}/status
   ↓
3. Subscribe to /topic/user/{userId}/typing
   ↓
4. Receive initial user statuses
   ↓
5. ChatHeader renders with status badge
   ↓
6. ChatBody ready for typing indicators
```

### User Starts Typing
```
1. User types in ChatInput textarea
   ↓
2. handleMessageChange() triggered
   ↓
3. sendTypingStatus(convId, true) called
   ↓
4. WebSocket sends to /app/user/typing
   ↓
5. Server broadcasts to participants
   ↓
6. ChatContext receives on /topic/user/{id}/typing
   ↓
7. setUserStatusMap() updates isTyping: true
   ↓
8. ChatBody detects change and renders TypingIndicator
   ↓
9. Auto-timeout after 1 second (debounce)
   ↓
10. Or explicit stop on message send
```

## Interaction Examples

### Example 1: One-on-One Chat
```
Alice (Online)     |     Bob (Typing...)
┌──────────────┐   |   ┌──────────────┐
│ Hi Bob! 🟢   │   |   │ John is      │
│              │   |   │ typing... ⚫⚫⚫│
│ 🟢 Active now│   |   │              │
└──────────────┘   |   └──────────────┘
```

### Example 2: Group Chat
```
┌──────────────────────────────────┐
│ Group Chat (3 participants)  🟢   │
│ Active now                        │
├──────────────────────────────────┤
│ Alice: Hello everyone             │
│ Bob: Hi there!                    │
│ Charlie is typing... ⚫⚫⚫        │
│                                   │
│ [Text input...]                   │
└──────────────────────────────────┘
```

## Error Handling

```
If WebSocket disconnected
    ↓
Subscriptions fail
    ↓
No status updates received
    ↓
userStatusMap remains as-is
    ↓
On reconnect:
    - Resubscribe to status topics
    - Request fresh status from server
    - Update userStatusMap
```

## Performance Considerations

1. **Debouncing**: Typing status sent max once per second
2. **Timeout**: Typing status auto-clears after 3 seconds
3. **Memory**: userStatusMap scales with active conversations
4. **Cleanup**: Typing timeouts cleared on component unmount
5. **Rendering**: Status badge doesn't re-render entire chat

## Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

All modern browsers support required WebSocket APIs and animations.
