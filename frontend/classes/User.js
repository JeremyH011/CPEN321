export default class User {
  constructor(json) {
    this.user_name = json["user_name"];
    this.user_email = json["user_email"];
  }
}
