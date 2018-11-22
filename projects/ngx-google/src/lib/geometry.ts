import {Position} from './position';

declare const google;

export class Geometry {

  computeDistanceBetween(center: Position, position: Position): number {
    // console.log('Geometry.computeDistanceBetween ...');

    const centerLoc = new google.maps.LatLng(center.latitude, center.longitude);
    const targetLoc = new google.maps.LatLng(position.latitude, position.longitude);
    return google.maps.geometry.spherical.computeDistanceBetween(centerLoc, targetLoc);
  }
}
