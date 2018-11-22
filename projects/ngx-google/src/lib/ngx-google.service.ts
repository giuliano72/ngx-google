import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Address} from './address';
import {Geocoder} from './geocoder';
import {Position} from './position';
import {Gmap} from './gmap';
import {Geometry} from './geometry';

declare var google3;

@Injectable({
  providedIn: 'root'
})
export class NgxGoogleService {

  geocodeClient(defaultPosition: Position): Observable<Position>{
    console.log('NgxGoogleService.geocodeClient ...');

    return new Observable<Position>((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(new Position(position.coords.latitude, position.coords.longitude));
            observer.complete();
          },
          () => {
            observer.next(defaultPosition);
            observer.complete();
          }
        );
      } else {
        observer.next(defaultPosition);
        observer.complete();
      }
    });
  }

  geocodeAddress(address: string): Observable<Address[]> {
    console.log('NgxGoogleService.geocodeAddress ...');

    const geocoder = new Geocoder();
    return geocoder.geocodeAddress(address);
  }

  geocodePosition(position: Position): Observable<Address> {
    console.log('NgxGoogleService.geocodePosition('+JSON.stringify(position)+') ...');

    const geocoder = new Geocoder();
    return geocoder.geocodePosition(position);

  }

  createMap(mapId: string, mapConfig: { zoom: number, center: Position }): Gmap {
    console.log('NgxGoogleService.createMap ...');

    const gmap = new Gmap(mapId, mapConfig);
    return gmap;
  }

  filterByCenterRadius(positions: Position[], center: Position, radius: number): Position[] {
    if (!positions) {
      if (!positions){
        console.log('Error: positions is null!');
      }

      return positions;

    } else {
      return positions.filter((position) => {
          const geometry = new Geometry();
          const distance_from_location = geometry.computeDistanceBetween(center, position);
          return (radius < 0 || distance_from_location < radius);
        });
    }
  }

  computeDistanceBetween(pos1: Position, pos2: Position){
    const geometry = new Geometry();
    return geometry.computeDistanceBetween(pos1, pos2);
  }

}






