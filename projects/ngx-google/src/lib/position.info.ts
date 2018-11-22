import {Position} from './position';

export class PositionInfo extends Position {
  info: any;

  constructor(latitude: number, longitude: number, info: any) {
    super(latitude, longitude);
    this.info = info;
  }

  clone() {
    return new PositionInfo(this.latitude, this.longitude, this.info);
  }
}
