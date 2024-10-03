export default class User {
  constructor(id, username, room) {
    this.id = id;
    this.username = username;
    this.room = room;
    this.isTyping = false;
    this.joinedAt = new Date().toISOString();
  }

  updateRoom(newRoom) {
    this.room = newRoom;
  }

  toggleIsTyping() {
    this.isTyping = !this.isTyping;
  }
}
