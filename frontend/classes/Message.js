export default class Message {
    constructor(json) {
      this.content = json["content"];
      this.senderId = json["senderId"];
      this.date = json["date"];
      this.messageId = json["messageId"];
      this.receiverId = json["receiverId"];
    }
  }