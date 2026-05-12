# Project Whisper
Check out the project slideshow: [Introducing.pdf](https://github.com/user-attachments/files/24553846/Introducing.pdf)

**Project Whisper** was encryption software designed for secure communications during the Second World War. It gave operators a way to encipher messages before transmission and to decipher incoming traffic, helping protect sensitive information from interception. This repository is a **modern re-creation** of that idea: a full-stack secure messaging and encryption system inspired by WW2-era tools like Enigma and Allied cipher systems. It includes a REST API, real-time messaging, multiple cipher methods, and an “intercept” workflow that echoes the period’s intelligence operations.

![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## Features

- **Multi-method encryption** — Six cipher/encoding methods: character shift, Caesar (key 3), reversal, AES-256, word/character substitution, and Base64
- **REST API** — Authenticated endpoints for encrypt, decrypt, and message analysis with rate limiting and security headers
- **Real-time messaging** — WebSocket server for live broadcast messaging between clients
- **Enigma-style simulation** — Pattern-based “intercept” flow for themed message decoding
- **Safety checks** — Optional content analysis and confirmation modal for sensitive-looking messages
- **Configurable backend** — Frontend can point to any backend IP for local or remote deployment

---

## Tech Stack

| Layer      | Technologies |
|-----------|--------------|
| Backend   | Node.js, Express, JWT (jsonwebtoken), bcryptjs, WebSocket (ws), crypto-js |
| Security  | Helmet, CORS, express-rate-limit |
| Frontend  | Vanilla JS, Tailwind CSS, CryptoJS, TensorFlow.js (optional/rule-based) |

---

## Access

To unlock the app from the landing page, use the auth key **`ATHENA123`** (or `ENIGMA42`, `WHISPER88`, `CODEX1945`).

---

## Project Structure

```
.
├── server.js              # Express + WebSocket server (API + real-time)
├── intro.html             # Landing / auth gate (Project Whisper)
├── project_whisper.html   # Main app: encrypt, decrypt, intercept, chat
├── package.json
└── README.md
```

---

## How to Run

### Prerequisites

- **Node.js** 18+ and **npm**

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

This starts:

- **REST API** at `http://localhost:3000`
- **WebSocket server** at `ws://localhost:3001`

### 3. Open the frontend

- **Option A — Direct file:**  
  Open `intro.html` in your browser (e.g. double-click or `file:///.../intro.html`).  
  Use the auth key **`ATHENA123`** (or `ENIGMA42`, `WHISPER88`, `CODEX1945`) to reach the main app.

- **Option B — Simple static server (recommended):**  
  From the project root, serve the folder so the app loads over `http://` (avoids some browser restrictions):

  ```bash
  npx serve .
  ```

  Then open the URL shown (e.g. `http://localhost:3000` from `serve`) and navigate to `intro.html`, or open `project_whisper.html` directly if you want to skip the intro.

### 4. Backend API authentication

The API expects a JWT in the `Authorization` header. Get a token by logging in:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"allied","password":"command"}'
```

Use the returned `token` in requests:

```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"Hello","method":"encA"}'
```

**Note:** The main app currently uses a demo token for API calls. For full encrypt/decrypt/analyze via the UI, either implement a login step that calls `/login` and sets the token, or use the in-page encryption/decryption (which works without the backend).

---

## API Overview

| Method | Endpoint   | Auth | Description |
|--------|------------|------|-------------|
| GET    | `/`        | No   | Health check |
| POST   | `/login`   | No   | Returns JWT for `username: allied`, `password: command` |
| POST   | `/encrypt` | Yes  | Body: `{ message, method }`. Returns `{ encrypted }` (tagged as `method_ciphertext`) |
| POST   | `/decrypt` | Yes  | Body: `{ message }` (tagged). Returns `{ decrypted }` |
| POST   | `/analyze` | Yes  | Body: `{ message }`. Returns `{ isEnigma, safe }` |

Encryption methods: `encA` (shift), `encB` (Caesar 3), `encC` (reverse), `encD` (AES-256), `encE` (word/char substitution), `encF` (Base64).

---

## Environment (optional)

| Variable   | Description           | Default |
|-----------|-----------------------|---------|
| `PORT`    | HTTP server port     | `3000`  |
| `JWT_SECRET` | Secret for signing JWTs | (in-code default; set in production) |

---

## Portfolio highlights

- **Secure API design:** JWT authentication, rate limiting, Helmet, and CORS
- **Multiple ciphers:** From simple substitution to AES-256, with consistent client/server behavior
- **Real-time layer:** WebSocket server for broadcast messaging
- **Themed UX:** WW2/Enigma-inspired flows and vocabulary
- **Modular structure:** Clear separation of backend API, WebSocket, and static frontend

---

