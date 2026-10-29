# GuessWho

## DB choices

### Users

- name [required] [string] [minlength_3] [maxlength_50]
- email [required] [string] [lowercase] [trim] [unique]
- password [string] [minlength_8] [required only when provider is local]
- provider [enum: local | google] [default: local]
- isVerified [boolean] [default: false]
- isDeleted [boolean] [default: false]
- profilePicturePath [string] [optional]
- twoWayAuth [boolean] [default: false]
- createdAt [date]
- updatedAt [date]

### Messages (anonymous messages)

- sender [objectId>>user] [required]
- reciever [objectId>>user] [required]
- content [string] [required] [trim] [minlength_2] [maxlength_500]
- isDeleted [boolean] [default: false]
- createdAt [date]
- updatedAt [date]

### Requests (identity requests)

- messageId [objectId>>message] [required] [unique]
- status [enum: pending | accepted] [default: pending]
- createdAt [date]
- updatedAt [date]

### Conversations

- messageId [objectId>>message] [required] [unique]
- sender [objectId>>user] [required]
- reciever [objectId>>user] [required]
- createdAt [date]
- updatedAt [date]

### ConversationMessages

- conversationId [objectId>>conversation] [required]
- sender [objectId>>user] [required]
- content [string] [required] [trim] [minlength_2] [maxlength_500]
- createdAt [date]
- updatedAt [date]

### OTP

- code [string] [required] [length_6]
- email [string] [required] [trim] [lowercase]
- expiresAt [date] [required] [TTL index: expireAfterSeconds 0]
- createdAt [date]

## Design decisions

- **Anonymity is a read-time rule, not a storage rule.** The message sender is always stored (identity requests need it) and is hidden only in the receiver's inbox query. It is revealed per message once an accepted request exists for it. There is no "isRevealed" flag, because it would duplicate the request status and could drift.
- **Request stores no sender or receiver.** Both live on the message, so requests reach them through a join on `messageId`. This avoids duplicated data at the cost of an aggregation.
- **Reject deletes the request.** Rejected requests are not stored, so the status enum has only `pending` and `accepted`. The unique index on `messageId` therefore never blocks a retry. The cost is no rejection history and no way to add a cooldown or retry cap later.
- **Conversation stores both participants.** This duplicates the message's sender and receiver on purpose, so "am I a participant?" checks and "my conversations" queries need no join.
- **Conversation messages are a separate collection from Messages.** Anonymous messages hide the sender, conversation messages never do. Keeping them apart means one query cannot leak the wrong behavior into the other.
- **ConversationMessage stores no receiver.** The receiver is the other participant of the conversation, so storing it would duplicate data.
- **Soft delete.** Users and messages use `isDeleted`. Reads filter on it. Nothing sets it to true yet.
- **Unique indexes.** `users.email`, `requests.messageId` and `conversations.messageId`. Mongoose only builds them if the collection is created after the index is declared, so confirm they exist in the DB.

## Known gaps

- A retry after a failed accept, or a simultaneous double-accept, hits the unique index on `conversations.messageId` and returns 500 instead of a clean error. Nothing is duplicated.
- The conversation is created before the request is marked accepted, so a failure in between leaves an orphan conversation.
- A revealed sender whose account was later deleted still shows their name in the receiver's inbox.
- Get conversation messages returns every field, with no projection.