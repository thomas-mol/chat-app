import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import Message from "../shared/classes/message.js";

// Constants
const serverAddress = ["http://192.168.178.20:4000", "http://localhost:4000"];

const usernameTag = document.getElementById("username");

const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-container");

const form = document.getElementById("form");

const activeUsers = document.getElementById("user-list");

// Socket IO

const socket = io(serverAddress[1]);

socket.on("connect", () => {
  console.log(`You're connected with id: ${socket.id}`);

  // Get username and room from the search params
  let username = new URLSearchParams(window.location.search).get("username");
  let room = new URLSearchParams(window.location.search).get("room");

  usernameTag.innerText = username;

  socket.emit("join-room", { username, room });
});

socket.on("user-list", (list) => {
  while (activeUsers.firstChild) {
    activeUsers.removeChild(activeUsers.firstChild);
  }

  list.forEach((name) => {
    let nameNode = document.createElement("li");
    nameNode.textContent = name;
    activeUsers.appendChild(nameNode);
  });
});

socket.on("welcome-message", (message) => {
  const messageContent = document.createElement("p");
  messageContent.innerText = message.content;

  const messageWrapper = document.createElement("li");
  messageWrapper.classList.add("message-notification");
  messageWrapper.appendChild(messageContent);
  messageContainer.appendChild(messageWrapper);
});

const serverMessages = new Set();

socket.on("server-message", (message) => {
  if (serverMessages.has(message.content)) {
    return;
  }

  serverMessages.add(message.content);

  const messageContent = document.createElement("p");
  messageContent.innerText = message.content;

  const messageWrapper = document.createElement("li");
  messageWrapper.classList.add("message-notification");
  messageWrapper.appendChild(messageContent);
  messageContainer.appendChild(messageWrapper);

  setTimeout(() => {
    messageWrapper.remove();
    serverMessages.delete(message.content);
  }, 5000);
});

socket.on("recieve-message", (message) => {
  const recievedMessage = new Message(
    message.username,
    message.senderId,
    message.content,
    new Date(message.timestamp)
  );
  displayMessage(recievedMessage);
});

socket.on("disconnect", () => {
  console.warn("Disconnected from server");
});

// Event Listeners

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (messageInput.value != "") {
    const message = new Message(username, socket.id, messageInput.value);
    displayMessage(message);
    socket.emit("send-message", message);
    messageInput.value = "";
  }
});

let typingTimeout;
messageInput.addEventListener("keypress", (e) => {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  socket.emit("is-typing", socket.id);

  typingTimeout = setTimeout(() => {
    socket.emit("stop-typing", socket.id);
  }, 500); // 500 ms delay before sending 'stop-typing' event to server
});

// Functions

function displayMessage(message) {
  messageContainer.appendChild(createMessageElement(message));
}

function createMessageElement(message) {
  // Create <span> with the timestamp
  const messageTimestamp = document.createElement("span");
  messageTimestamp.textContent =
    message.senderId == socket.id
      ? `${message.getTimestamp()}`
      : `${message.username} · ${message.getTimestamp()}`;

  // Create <p> with the message content
  const messageContent = document.createElement("p");
  messageContent.classList.add("message");
  messageContent.innerText = message.content;

  // Create <li> and add class depending if user is sender / reciever
  const messageWrapper = document.createElement("li");
  messageWrapper.classList.add(
    message.senderId == socket.id ? "message-right" : "message-left"
  );

  messageContent.appendChild(messageTimestamp);
  messageWrapper.appendChild(messageContent);

  return messageWrapper;
}
