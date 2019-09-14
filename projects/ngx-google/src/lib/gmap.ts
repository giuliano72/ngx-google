import {Gmarker} from './gmarker';
import {Position} from './position';
import {Gcircle} from './gcircle';
import {style} from '@angular/animations';

declare const google;

export class Gmap {

  private map: any;
  private centerMarker: Gmarker;

  constructor(mapId: string, mapConfig: {zoom: number, center: Position, styles: any}) {
    // console.log('new Gmap(' + mapId + ')');
    if (mapConfig.styles) {
      this.map = new google.maps.Map(document.getElementById(mapId), {
        zoom: mapConfig.zoom,
        center: new google.maps.LatLng(
          mapConfig.center.latitude,
          mapConfig.center.longitude
        ),
        styles: mapConfig.styles
      });
    } else {
      this.map = new google.maps.Map(document.getElementById(mapId), {
        zoom: mapConfig.zoom,
        center: new google.maps.LatLng(
          mapConfig.center.latitude,
          mapConfig.center.longitude
        )
      });
    }
  }

  get zoom() {
    return this.map.getZoom();
  }

  set zoom(zoom: number) {
    // console.log('Gmap set zoom: ' + zoom);
    this.map.setZoom(+zoom);
  }

  get center(): Position {
    return new Position(this.map.center.lat() , this.map.center.lng());
  }

  set center(position: Position) {
    this.map.setCenter({lat: +position.latitude, lng: +position.longitude});
  }

  set style(value) {
    console.log('Gmap set style');
    this.map.setOptions({styles: value});
  }

  addMarker(position: Position, image, draggable: boolean, isCenterMarker = false): Gmarker {
    const marker = new google.maps.Marker({
      position: {lat: +position.latitude, lng: +position.longitude},
      map: this.map,
      draggable: draggable
    });

    if (image) {
      marker.setIcon(image);
    }

    if (draggable) {
      marker.setZIndex(99999999);
    }

    const gMarker = new Gmarker(marker, this.map);

    if (isCenterMarker){
      this.centerMarker = gMarker;
    }

    return gMarker;

  }

  clearMarkers() {

  }


  addCircle(position: Position, radius: number, draggable: boolean, options: any): Gcircle {
    const circle = new google.maps.Circle({
      strokeColor: (options && options.strokeColor) ? options.strokeColor : null,
      strokeOpacity: (options && options.strokeOpacity) ? options.strokeOpacity : null,
      strokeWeight: (options && options.strokeWeight) ? options.strokeWeight : null,
      fillColor: (options && options.fillColor) ? options.fillColor : null,
      fillOpacity: (options && options.fillOpacity) ? options.fillOpacity : null,
      map: this.map,
      center: {lat: +position.latitude, lng: +position.longitude},
      radius: radius,
      draggable: draggable
    });

    return new Gcircle(circle);
  }

  computeDistanceFromCenter(position: Position): number {
    if(this.centerMarker) {
      const centerLoc = new google.maps.LatLng(this.centerMarker.position.latitude, this.centerMarker.position.longitude);
      const targetLoc = new google.maps.LatLng(position.latitude, position.longitude);
      return google.maps.geometry.spherical.computeDistanceBetween(centerLoc, targetLoc);
    } else {
      return 0;
    }
  }


  private computeDistanceBetween(center: Position, position: Position): number {
    const centerLoc = new google.maps.LatLng(center.latitude, center.longitude);
    const targetLoc = new google.maps.LatLng(position.latitude, position.longitude);
    return google.maps.geometry.spherical.computeDistanceBetween(centerLoc, targetLoc);
  }
}
