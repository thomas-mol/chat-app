# Chat App

This is a simple real-time chat application built with Node.js, Express, and Socket.IO. It includes both a client and server component, where users can join a chatroom and exchange messages in real time.

## Features

- Real-time messaging using Socket.IO.
- Client-server architecture with separate `client` and `server` directories.
- Basic user interface for joining and participating in a chatroom.
- Clean and minimal CSS styles for login and chat interfaces.

## Prerequisites

- [Node.js](https://nodejs.org/) installed.
- npm (comes with Node.js) for managing dependencies.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

### 2. Install dependencies

```bash
cd client; npm install; cd ../server; npm install
```

### 3. Running the server

```bash
npm start
```

The server will be running on http://localhost:4000 ( You can change the address in client/script.js OR in the docker-compose file. )
