export default class Listing {
  constructor(json) {
    this.title = json["title"];
    this.latitude = json["latitude"];
    this.longitude = json["longitude"];
    this.address = json["address"];
    this.price = json["price"];
    this.numBeds = json["numBeds"];
    this.numBaths= json["numBaths"];
    this.mapsUrl = json["maps_url"];

    this.tapped = false;
  }
}
