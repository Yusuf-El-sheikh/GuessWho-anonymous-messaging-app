# GuessWho?

An anonymous messaging API. Users send messages to other registered users without revealing who they are. The receiver can ask to know the sender, and if the sender accepts, the two get a private conversation.

## Features

- **Anonymous messaging:** the sender is stored but never exposed to the receiver until they agree to be revealed.
- **Identity requests:** the receiver can ask who sent a specific message. The sender accepts or rejects.
- **Private conversations:** accepting a request opens a conversation that only the two participants can read or write.
- **Authentication:** email and password with OTP verification, optional two-way authentication, Google sign-in, and password reset.
- **Profile pictures:** upload with file-signature validation, not just MIME type.

## How it works

1. **Send:** a logged-in user sends an anonymous message to another registered user.
2. **Request identity:** the receiver asks to know who sent a specific message, creating a `pending` request.
3. **Respond:** the sender reviews pending requests.
   - **Reject:** the request is deleted, the sender stays hidden, and the receiver can ask again.
   - **Accept:** the sender is revealed on that message in the receiver's inbox, and a conversation is created.
4. **Chat:** both users send and read messages inside the conversation.

## Tech stack

- Node.js (ES modules) and Express 5
- MongoDB with Mongoose
- Redis (idempotency keys and caching)
- Zod (validation)
- JWT in an httpOnly cookie, bcrypt, Google OAuth
- Mailjet and Nodemailer (email)
- Multer and file-type (uploads)

## Architecture

Each feature is a module with the same layers: `router`, `controller`, `dto`, `service`, `repository`, `model`.

- Controllers validate input and shape responses.
- Services hold business rules and authorization checks.
- Repositories are the only layer that touches the database.
- Modules talk to each other through services, never through another module's repository or model.

Cross-cutting concerns live in `lib/` and `pkg/`: a global error handler, a custom `AppError`, structured JSON logging with a correlation id on every request, an idempotency middleware, and a cache provider.

```
src/
  app/
    auth/                  register, verify, login, OTP, two-way auth, Google
    user/                  profile picture upload
    message/               anonymous messages and the inbox
    request/               identity requests
    conversation/          conversations created on accept
    conversation-messages/ messages inside a conversation
  lib/                     config, db, cache, email, errors, validation, guards
  pkg/                     logger, correlation id, Redis and Mailjet providers
  index.js                 app setup and routes
  server.js                HTTP server and graceful shutdown
docs/
  Contract.md              full API reference
  db_design_choices.md     data models and design decisions
```

## Design highlights

- **Anonymity is enforced at read time.** The sender is always stored, and the inbox query only attaches a limited sender profile (name and picture) to messages with an accepted request. Email and password hash are never projected.
- **No duplicated state.** Requests store only the message id and a status. Reveal status is derived from the request, not stored as a flag.
- **Authorization returns uniform errors.** "Not found" and "not yours" return the same 404, so ids can't be probed.
- **Conversation messages are separate from anonymous messages,** so the two behaviors can't leak into each other.

## Getting started

### Prerequisites

- Node.js
- MongoDB
- Redis
- A Mailjet account
- A Google OAuth client id

### Install and run

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3000` by default.

### Environment variables

Create a `.env` file in the project root. The app validates these on startup.

| Variable | Description |
| --- | --- |
| `PORT` | Server port (default 3000) |
| `DB_URL` | MongoDB connection string |
| `APP_NAME` | App name, used as the email sender name |
| `EMAIL` | Sender email address |
| `APP_PASS` | Email app password |
| `SECRET_TOKEN_KEY` | Secret used to sign JWTs |
| `GOOGLE_CLIENT_ID` | Google OAuth client id |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port (default 6379) |
| `REDIS_PASS` | Redis password |
| `MAILJET_API_KEY` | Mailjet API key |
| `MAILJET_SECRET` | Mailjet secret key |

Never commit `.env`. It is already in `.gitignore`.

## API

All routes live under `/guess-who`. Full request and response details are in [`docs/Contract.md`](docs/Contract.md).

| Area | Base path |
| --- | --- |
| Auth | `/guess-who/auth` |
| User | `/guess-who/user` |
| Messages | `/guess-who/message` |
| Requests | `/guess-who/request` |
| Conversations | `/guess-who/conversation` |

Protected routes need the `access_token` cookie, set on login and valid for 6 hours.

Data models and design decisions are in [`docs/db_design_choices.md`](docs/db_design_choices.md).