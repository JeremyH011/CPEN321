export default class ChatRoom {
    constructor(json) {
        this.chatRoomId = json["chatRoomId"];
        this.chatteeName = json["chatteeName"];
        this.chatteeId = json["chatteeId"];
    }
  }