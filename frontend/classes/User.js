export default class User {
  constructor(json) {
    this.name = json["name"];
    this.email = json["email"];
    this.age = json["age"];
    this.job = json["job"];
    this.optIn = json["optIn"];
    this.photo = json["photo"];
  }
}
