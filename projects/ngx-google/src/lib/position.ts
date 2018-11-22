export class Position {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  clone() {
    return new Position(this.latitude, this.longitude);
  }
}
