import {Position} from './position';

export class Gcircle {
  private circle: any;
  private centerChanged = false;

  constructor(circle) {
    this.circle = circle;
  }

  get radius(): number {
    return this.circle.getRadius();
  }

  set radius(radius: number) {
    this.circle.setRadius(+radius);
  }

  get center(): Position {
    return new Position(this.circle.center.lat() , this.circle.center.lng());
  }

  set center(position: Position) {
    this.centerChanged = true;
    this.circle.setCenter({lat: +position.latitude, lng: +position.longitude});
  }

  addListener(event: string, callback) {

    if (event === 'center_changed') {
      this.circle.addListener('center_changed', () => {
        if (!this.centerChanged) {
          callback();

        } else {
          this.centerChanged = false;
        }
      });
    } else {
      this.circle.addListener(event, callback);
    }
  }

  delete(): void {
    this.circle.setMap(null);
  }
}
