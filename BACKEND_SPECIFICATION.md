# Backend WebSocket Endpoints - Specification

This document specifies the WebSocket endpoints needed on the backend to support the online/offline status and typing indicator features.

## Overview

The frontend uses STOMP protocol over WebSocket to:
1. Send user status and typing information
2. Receive status and typing updates from other users

## Required Endpoints

### 1. Send User Status (Optional - Can be implicit on login/logout)

**Destination:** `/app/user/status`

**Message Format:**
```json
{
  "userId": "string (UUID)",
  "status": "online" | "offline",
  "timestamp": "string (ISO-8601)"
}
```

**When to Send:**
- When user logs in (status: "online")
- When user logs out (status: "offline")
- When user goes idle (status: "offline")
- Optional: When user comes back from idle (status: "online")

**Handler Implementation:**
```java
@MessageMapping("/user/status")
public void handleUserStatus(UserStatusUpdate statusUpdate, Principal principal) {
    // Verify user matches authenticated principal
    String userId = principal.getName();
    
    // Broadcast to all connected users
    template.convertAndSend(
        "/topic/user/" + userId + "/status",
        statusUpdate
    );
}
```

---

### 2. Send Typing Status

**Destination:** `/app/user/typing`

**Message Format:**
```json
{
  "userId": "string (UUID)",
  "conversationId": "string (UUID)",
  "isTyping": boolean,
  "timestamp": "string (ISO-8601)"
}
```

**When to Send:**
- When user starts typing (isTyping: true)
- When user stops typing (isTyping: false)
- Frontend will debounce to max once per second

**Handler Implementation:**
```java
@MessageMapping("/user/typing")
public void handleTypingStatus(UserTypingStatus typingStatus, Principal principal) {
    // Verify user matches authenticated principal
    String userId = principal.getName();
    
    // Get conversation and broadcast to participants
    Conversation conv = conversationService.getConversation(typingStatus.getConversationId());
    
    for (String participantId : conv.getParticipantIds()) {
        // Don't send back to sender
        if (!participantId.equals(userId)) {
            template.convertAndSend(
                "/topic/user/" + participantId + "/typing",
                typingStatus
            );
        }
    }
}
```

---

### 3. Subscribe: User Status Updates (Frontend Only)

**Topic:** `/topic/user/{userId}/status`

**Message Format (Received):**
```json
{
  "userId": "string (UUID)",
  "status": "online" | "offline",
  "timestamp": "string (ISO-8601)"
}
```

**Frontend Subscription:**
```typescript
client.subscribe(`/topic/user/${user.user.id}/status`, (message) => {
    const statusUpdate = JSON.parse(message.body);
    // Update UI with status
});
```

---

### 4. Subscribe: Typing Status Updates (Frontend Only)

**Topic:** `/topic/user/{userId}/typing`

**Message Format (Received):**
```json
{
  "userId": "string (UUID)",
  "conversationId": "string (UUID)",
  "isTyping": boolean,
  "timestamp": "string (ISO-8601)"
}
```

**Frontend Subscription:**
```typescript
client.subscribe(`/topic/user/${user.user.id}/typing`, (message) => {
    const typingStatus = JSON.parse(message.body);
    // Show/hide typing indicator
});
```

---

## Implementation Steps

### Step 1: Create DTO Classes

```java
// UserStatusUpdate.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatusUpdate {
    private String userId;
    private String status; // "online" or "offline"
    private String timestamp; // ISO-8601 format
}

// UserTypingStatus.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserTypingStatus {
    private String userId;
    private String conversationId;
    private boolean isTyping;
    private String timestamp; // ISO-8601 format
}
```

### Step 2: Create WebSocket Controller

```java
// WebSocketController.java
@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate template;
    
    @Autowired
    private ConversationService conversationService;

    /**
     * Handle user status updates (online/offline)
     */
    @MessageMapping("/user/status")
    public void handleUserStatus(
            UserStatusUpdate statusUpdate,
            Principal principal) {
        
        String userId = principal.getName();
        
        // Verify the user sending matches the status
        if (!userId.equals(statusUpdate.getUserId())) {
            throw new UnauthorizedException("Cannot update status for other users");
        }
        
        // Broadcast to all connected clients
        template.convertAndSend(
            "/topic/user/" + userId + "/status",
            statusUpdate
        );
        
        // Optional: Save to database for persistence
        // userService.updateUserStatus(userId, statusUpdate.getStatus());
    }

    /**
     * Handle typing status
     */
    @MessageMapping("/user/typing")
    public void handleTypingStatus(
            UserTypingStatus typingStatus,
            Principal principal) {
        
        String userId = principal.getName();
        
        // Verify the user sending matches the typing status
        if (!userId.equals(typingStatus.getUserId())) {
            throw new UnauthorizedException("Cannot send typing status for other users");
        }
        
        // Get conversation to find participants
        try {
            Conversation conversation = conversationService
                .getConversationById(typingStatus.getConversationId());
            
            if (conversation == null) {
                throw new ResourceNotFoundException("Conversation not found");
            }
            
            // Send typing status to all participants except sender
            for (String participantId : conversation.getParticipantIds()) {
                if (!participantId.equals(userId)) {
                    template.convertAndSend(
                        "/topic/user/" + participantId + "/typing",
                        typingStatus
                    );
                }
            }
        } catch (Exception e) {
            logger.error("Error handling typing status", e);
        }
    }

    /**
     * Handle user disconnect - optional
     */
    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        String userId = event.getUser().getName();
        
        // Broadcast offline status
        UserStatusUpdate offlineStatus = new UserStatusUpdate(
            userId,
            "offline",
            Instant.now().toString()
        );
        
        template.convertAndSend(
            "/topic/user/" + userId + "/status",
            offlineStatus
        );
    }
}
```

### Step 3: WebSocket Configuration

```java
// WebSocketConfig.java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/api/ws")
            .setAllowedOrigins("*")
            .withSockJS();
    }
}
```

---

## Message Flow Examples

### Example 1: User Comes Online

```
Frontend                          Backend                    All Users
   |                                |                            |
   | User logs in                   |                            |
   | WebSocket connects             |                            |
   |--------/connect--------→       |                            |
   |                                |                            |
   | Subscribes to status topic     |                            |
   |----/subscribe /topic/user/123/status                        |
   |                                |                            |
   | Sends online status            |                            |
   |----/app/user/status---→        |                            |
   |    {userId, "online"}          |                            |
   |                        Broadcasts to all     |              |
   |                        /topic/user/123/status ─→ Update UIs |
```

### Example 2: User Types in Chat

```
Frontend (User A)                 Backend                  Frontend (User B)
   |                                |                            |
   | User starts typing             |                            |
   | onChange event fires           |                            |
   |                                |                            |
   | Debounce timer starts          |                            |
   | (1 second)                     |                            |
   |                                |                            |
   | Send typing status             |                            |
   |----/app/user/typing---→        |                            |
   |    {userId, convId, true}      |                            |
   |                        Finds participants                    |
   |                        Broadcasts to User B                  |
   |                                |---/topic/user/{B}/typing→  |
   |                                |   {userId: A, isTyping:true}|
   |                                |                     Show indicator|
   |                                |                            |
   | After 1 second timeout         |                            |
   | OR message sent:               |                            |
   |                                |                            |
   | Send typing stop               |                            |
   |----/app/user/typing---→        |                            |
   |    {userId, convId, false}     |                            |
   |                        Broadcasts to User B                  |
   |                                |---/topic/user/{B}/typing→  |
   |                                |   {userId: A, isTyping:false}|
   |                                |                    Hide indicator|
```

---

## Error Handling

### Unauthorized Access
```json
{
  "error": "Cannot update status for other users",
  "status": 401
}
```

### Conversation Not Found
```json
{
  "error": "Conversation not found",
  "status": 404
}
```

### Invalid Message Format
```json
{
  "error": "Invalid message format",
  "status": 400
}
```

---

## Testing with Postman/WebSocket Client

### 1. Connect to WebSocket
```
URL: ws://localhost:8888/api/ws
Protocol: STOMP 1.2
```

### 2. Subscribe to Status Topic
```
SUBSCRIBE
id:sub-1
destination:/topic/user/user-123/status

CONNECTED
id:sub-1
version:1.2
```

### 3. Send Status Update
```
SEND
destination:/app/user/status
content-type:application/json

{"userId":"user-123","status":"online","timestamp":"2025-11-16T10:30:00Z"}
```

### 4. Receive Status Update
```
MESSAGE
destination:/topic/user/user-123/status
message-id:msg-1

{"userId":"user-123","status":"online","timestamp":"2025-11-16T10:30:00Z"}
```

---

## Performance Considerations

1. **Debouncing**: Frontend debounces typing to max 1 msg/second
2. **Filtering**: Backend only sends to conversation participants
3. **Broadcasting**: Use efficient topic-based publishing
4. **Cleanup**: Auto-remove inactive typing status after timeout
5. **Scalability**: Consider Redis pub/sub for multi-server setups

---

## Database (Optional - For Persistence)

```sql
-- Store last known status (optional)
CREATE TABLE user_status (
    user_id UUID PRIMARY KEY,
    status VARCHAR(20), -- 'online' or 'offline'
    last_seen TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Frontend Integration

The frontend implementation is complete and ready to use. No additional changes needed on frontend once these backend endpoints are implemented.

### Files to Update on Backend:
- ✅ Create DTOs
- ✅ Create WebSocket Controller
- ✅ Update WebSocket Configuration
- ✅ Add error handling
- ✅ Add logging

All frontend code is ready and will work once backend sends/receives these messages!
