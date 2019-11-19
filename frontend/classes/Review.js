export default class User {
  constructor(json) {
  this.revieweeId = json["revieweeId"];
  this.reviewerId = json["reviewerId"];
  this.reviewerName = json["reviewerName"];
  this.revieweeName = json["revieweeName"];
  this.relationship = json["relationship"];
  this.reviewRating = json["reviewRating"];
  this.reviewText = json["reviewText"];
  }
}
