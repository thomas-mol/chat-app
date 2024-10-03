export default class Message {
  constructor(username, senderId, content) {
    this.username = username;
    this.senderId = senderId;
    this.content = content;
    this.timestamp = new Date();
  }

  getTimestamp() {
    let hours = this.timestamp.getHours();
    let minutes = this.timestamp.getMinutes();

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  }
}
