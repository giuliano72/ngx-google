import {Position} from './position';

declare const google;

export class Gmarker {
  private marker: any;
  private infoWindow: any;
  private map: any;

  private positionChanged = false;

  constructor(marker, map) {
    this.marker = marker;
    this.map = map;
  }

  get position(): Position {
    return new Position(this.marker.position.lat() , this.marker.position.lng());
  }

  set position(position: Position) {
    this.positionChanged = true;
    this.marker.setPosition({lat: +position.latitude, lng: +position.longitude});
  }

  addListener(event: string, callback) {

    if (event === 'position_changed') {
      this.marker.addListener('position_changed', () => {
        if (!this.positionChanged) {
          callback();

        } else {
          this.positionChanged = false;
        }
      });
    } else {
      this.marker.addListener(event, callback);
    }
  }

  showInfo(content){
    this.infoWindow = new google.maps.InfoWindow({
      content: content
    });
    this.infoWindow.open(this.map, this.marker);
  }

  hideInfo() {
    if (this.infoWindow) {
      console.log('hideInfo');
      this.infoWindow.close();
    }
  }

  delete() {
    this.marker.setMap(null);
  }
}
