import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import Message from "./classes/message.js";

// Constants
const serverAddress = "http://192.168.178.20:4000";

const usernameTag = document.getElementById("username");
const roomTag = document.getElementById("room");

const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-container");

const form = document.getElementById("form");

const activeUsers = document.getElementById("user-list");

// Socket IO

const socket = io(serverAddress);

let _senderId = "";

socket.on("connect", () => {
  console.log(`You're connected with id: ${socket.id}`);
  _senderId = socket.id;

  // Get username and room from the search params
  let username = new URLSearchParams(window.location.search).get("username");
  let room = new URLSearchParams(window.location.search).get("room");

  usernameTag.innerText = username;
  roomTag.innerText = room;
});

socket.emit("join-room", { username, room });

socket.on("user-list", (list) => {
  list.forEach((name) => {
    let nameNode = document.createElement("li");
    nameNode.textContent = name;
    activeUsers.appendChild(nameNode);
  });
});

socket.on("recieve-message", (message) => {
  // Convert the recieved JSON back into Message Object
  const recievedMessage = new Message(
    message.username,
    message.senderId,
    message.content,
    new Date(message.timestamp)
  );
  displayMessage(recievedMessage);
});

socket.on("disconnect", () => {
  console.error("Disconnected from server");
});

// Event Listeners

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (messageInput.value != "") {
    const message = new Message(username, _senderId, messageInput.value);
    displayMessage(message);
    socket.emit("send-message", message);
    messageInput.value = "";
  }
});

// Functions

function displayMessage(message) {
  messageContainer.appendChild(createMessageElement(message));
}

function createMessageElement(message) {
  // Create <span> with the timestamp
  const messageTimestamp = document.createElement("span");
  messageTimestamp.textContent = `${
    message.username
  } · ${message.getTimestamp()}`;

  // Create <p> with the message content
  const messageContent = document.createElement("p");
  messageContent.classList.add("message");
  messageContent.innerText = message.content;

  // Create <li> and add class depending if user is sender / reciever
  const messageWrapper = document.createElement("li");
  messageWrapper.classList.add(
    message.senderId == _senderId ? "message-right" : "message-left"
  );

  messageContent.appendChild(messageTimestamp);
  messageWrapper.appendChild(messageContent);

  return messageWrapper;
}
