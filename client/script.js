import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import Message from "./classes/message.js";

// Constants

const usernameInput = document.getElementById("username");
const editUsername = document.getElementById("edit-username");
const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-container");
const form = document.getElementById("form");
const activeUsers = document.getElementById("active-users");

//    'Private' variables

let _senderId = "";
let _username = document.getElementById("username").value;

// Socket IO

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log(`You're connected with id: ${socket.id}`);
  _senderId = socket.id;
});

socket.on("clients-total", (totalClients) => {
  console.log(`Clients connected: ${totalClients}`);
  activeUsers.innerText = `Active users: ${totalClients}`;
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
    const message = new Message(_username, _senderId, messageInput.value);
    displayMessage(message);
    socket.emit("send-message", message);
    messageInput.value = "";
  }
});

editUsername.addEventListener("click", () => {
  usernameInput.disabled = false;
  usernameInput.focus();

  usernameInput.addEventListener(
    "blur",
    () => {
      _username = usernameInput.value;
      usernameInput.disabled = true;
    },
    { once: true }
  );
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
