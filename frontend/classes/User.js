export default class User {
  constructor(json) {
    this.name = json["name"];
    this.email = json["email"];
  }
}
