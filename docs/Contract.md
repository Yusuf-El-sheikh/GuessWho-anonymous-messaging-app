# GuessWho API Contract

Base URL: `http://localhost:3000/guess-who`

## Conventions

- **Auth:** routes marked 🔒 need the `access_token` cookie (httpOnly, set on login, valid for 6 hours). A missing token returns 403.
- **Errors:** every error has the shape `{ "message": "Invalid action: ..." }`.
- **Ids:** all ids are MongoDB ObjectIds as strings. A malformed id returns 400.
- **Anonymity:** a message's sender is never exposed to its receiver until the sender accepts the receiver's identity request.

---

## Auth API (`/auth`)

### Register
`POST /auth/register-user`
Body: `{ "name": "string 3-50", "email": "string", "password": "string min 8" }`
- **201:** the created user (no password). An OTP is emailed.
- **400:** validation. **409:** email already registered.

### Verify account
`PATCH /auth/verify-account`
Body: `{ "email": "string", "code": "6 chars" }`
- **200:** `{ "message": "Your account has been verified successfully." }`
- **400:** wrong code. **401:** unknown email.

### Resend OTP
`POST /auth/resend-otp`
Body: `{ "email": "string" }`
- **200:** `{ "message": "Verification code sent to your mailbox" }`
- **401:** unknown email.

### Login
`POST /auth/login`
Body: `{ "email": "string", "password": "string" }`
- **200:** `{ "message": "Logged in successfully" }` and the `access_token` cookie is set.
- **202:** two-way auth is on. No cookie. A code is emailed, then call "Login with two-way auth".
- **401:** invalid credentials. **403:** account not verified.

### Login with two-way auth
`POST /auth/login-with-two-way-authentication`
Body: `{ "email": "string", "code": "6 chars" }`
- **200:** `{ "message": "Logged in successfully" }` and the cookie is set.
- **400:** wrong code, or two-way auth not enabled. **401:** unknown email.

### Login with Google
`POST /auth/login-with-google`
Body: `{ "idToken": "string" }`
- **200:** `{ "message": "Logged in successfully" }` and the cookie is set.
- **401:** invalid Google token.

### Reset password
`POST /auth/reset-password`
Header: `Idempotency-Key` (a repeat with the same key returns the cached response).
Body: `{ "email": "string", "newPassword": "string min 8", "code": "6 chars" }`
- **200:** `{ "message": "Your password was reset successfully" }`
- **400:** wrong code. **401:** unknown email.

### Update two-way auth 🔒
`PATCH /auth/update-two-way-authentication`
Body: `{ "twoWayAuth": true | false, "code": "6 chars" }` (the code is an OTP sent to your own email via resend-otp)
- **200:** `{ "message": "Two-way authentication updated successfully" }`
- **400:** wrong code.

---

## User API (`/user`)

### Upload profile picture 🔒
`POST /user/upload-profile-picture`
Body: `multipart/form-data`, file field **`profile-picture`**, PNG or JPEG, max 5 MB.
- **200:** `{ "message": "Profile picture updated successfully" }`
- **400:** wrong type or too large. **404:** user not found.

---

## Message API (`/message`): anonymous messages

### Send message 🔒
`POST /message`
Body: `{ "reciever": "userId", "content": "string 2-500" }`
The sender is taken from the cookie and stored, but never shown to the receiver.
- **200:** `{ "message": "Message sent successfully." }`
- **400:** validation, or messaging yourself.
- **404:** receiver not found, deleted, or unverified.

### Get my inbox 🔒
`GET /message/get-all-messages`
- **200:** array (empty array if there are none).
```json
[
  {
    "_id": "messageId",
    "content": "hi there",
    "createdAt": "...",
    "updatedAt": "...",
    "sender": { "name": "..." }
  }
]
```
`sender` appears **only** on messages whose identity request was accepted. It has `name` and, if set, `profilePicturePath`. Otherwise the field is absent.

---

## Request API (`/request`): identity requests

### Request sender identity 🔒
`POST /request/request-info/:messageId`
Called by the **receiver** of the message. No body. Creates a request with status `pending`.
- **201:** `{ "message": "Request sent successfully" }`
- **400:** invalid id.
- **404:** message not found, deleted, or not yours.
- **409:** a request already exists for this message.

### Get my requests 🔒
`GET /request/my-requests`
Called by the **sender**. Returns pending requests on messages they sent.
- **200:** array (empty if none).
```json
[
  {
    "_id": "requestId",
    "createdAt": "...",
    "message": { "reciever": "userId", "content": "hi there" }
  }
]
```

### Respond to request 🔒
`PATCH /request/respond/:requestId`
Called by the **sender** of the message.
Body: `{ "action": "accept" | "reject" }`
- **200 (accept):** `{ "message": "Request accepted successfully", "conversationId": "..." }`. Status becomes `accepted` and a conversation is created.
- **200 (reject):** `{ "message": "Request rejected successfully" }`. The request is deleted, so the receiver can ask again.
- **400:** invalid id or action.
- **404:** request not found, not pending, or you are not the message's sender.

---

## Conversation API (`/conversation`)

Only the two participants (the original sender and receiver) can use these. Anyone else gets the same 404 as a missing conversation.

### Send conversation message 🔒
`POST /conversation/:conversationId/messages`
Body: `{ "content": "string 2-500" }`
- **201:** `{ "message": "Message sent successfully" }`
- **400:** validation. **404:** conversation not found or not yours.

### Get conversation messages 🔒
`GET /conversation/:conversationId/messages`
- **200:** array, oldest first (empty if none).
```json
[
  {
    "_id": "...",
    "conversationId": "...",
    "sender": "userId",
    "content": "hello",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```
- **400:** invalid id. **404:** conversation not found or not yours.

---

## Typical flow

1. A sends a message to B (`POST /message`). B's inbox shows it with no sender.
2. B requests the sender's identity (`POST /request/request-info/:messageId`).
3. A sees it in `GET /request/my-requests` and responds with `accept` or `reject`.
4. On accept, B's inbox now shows `sender.name` on that message, and both users chat through the conversation id returned by the accept.