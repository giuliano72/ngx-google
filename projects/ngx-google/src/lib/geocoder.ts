import {Observable} from 'rxjs';
import {Address} from './address';
import {Position} from './position';

declare const google;

export class Geocoder {
  private geocoder: any;

  constructor() {
    this.geocoder = new google.maps.Geocoder();
  }

  static checkRoute(item) {
    return item.types.indexOf('route') > -1;
  }

  static checkStreetNumber(item) {
    return item.types.indexOf('street_number') > -1;
  }

  static checkPostalCode(item)  {
    return item.types.indexOf('postal_code') > -1;
  }

  static checkLocality(item) {
    return item.types.indexOf('locality') > -1;
  }

  static checkProvince(item) {
    return item.types.indexOf('administrative_area_level_2') > -1;
  }

  static checkRegion(item) {
    return item.types.indexOf('administrative_area_level_1') > -1;
  }

  static checkCountry(item) {
    return item.types.indexOf('country') > -1;
  }

  private static getLocationComponents(location) {

    let resultMap = null;

    if (location) {
      resultMap = [];
      const components = location.address_components;
      const route = components.find(Geocoder.checkRoute);
      if (route) {
        resultMap['route'] = route.long_name;
      }

      const street_number = components.find(Geocoder.checkStreetNumber);
      if (street_number) {
        resultMap['street_number'] = street_number.long_name;
      }

      const postal_code = components.find(Geocoder.checkPostalCode);
      if (postal_code) {
        resultMap['postal_code'] = postal_code.long_name;
      }

      const locality = components.find(Geocoder.checkLocality);
      if (locality) {
        resultMap['locality'] = locality.long_name;
      }

      const province = components.find(Geocoder.checkProvince);
      if (province) {
        resultMap['province'] = province.short_name;
      }

      const region = components.find(Geocoder.checkRegion);
      if (region) {
        resultMap['region'] = region.long_name;
      }

      const country = components.find(Geocoder.checkCountry);
      if (country) {
        resultMap['country'] = country.long_name;
        resultMap['country_code'] = country.short_name;
      }
    }
    return resultMap;
  }

  geocodeAddress(address: string): Observable<Address[]> {
    return new Observable<Address[]>((observer) => {

      // console.log('Geocoder.geocodeAddress');
      // console.log('address: ' + JSON.stringify(address));

      if (address && address.length > 0) {

        const request = {
          address: address,
          region: 'it',
          componentRestrictions: {administrativeArea: 'administrative_area_level_3'}
        };
        this.geocoder.geocode(request, function (results, status) {
          // console.log('geocodeAddress status: ' + status);
          if (status === 'OK') {
            if (results) {

              const data = results.map(function (item) {
                // console.log('geocodeAddress result item: ' + JSON.stringify(item));

                const components = Geocoder.getLocationComponents(item);
                // console.log('geocodeAddress: ' + JSON.stringify(components));

                return {
                  value: item.formatted_address,
                  route: components['route'],
                  street_number: components['street_number'],
                  postal_code: components['postal_code'],
                  locality: components['locality'],
                  province: components['province'],
                  region: components['region'],
                  country: components['country'],
                  country_code: components['country_code'],
                  lat: item.geometry.location.lat(),
                  lng: item.geometry.location.lng()
                };
              });

              // console.log('geocodeAddress data: ' + JSON.stringify(data));
              observer.next(data);
              observer.complete();
            } else {
              observer.next([]);
              observer.complete();
            }
          } else {
            observer.next([]);
            observer.complete();
          }
        });
      } else {
        observer.next([]);
        observer.complete();
      }
    });
  }

  geocodePosition(position: Position): Observable<Address> {
    return new Observable<Address>((observer) => {

      // console.log('Geocoder.geocodePosition');
      // console.log('position: ' + JSON.stringify(position));

      if (position) {

        const request = {
          location: new google.maps.LatLng(position.latitude, position.longitude),
        };
        this.geocoder.geocode(request, function (results, status) {
          // console.log('geocodePosition status: ' + status);
          if (status === 'OK') {
            if (results && results.length > 0) {

              const data = results.map(function (item) {
                // console.log('geocodePosition: ' + JSON.stringify(item));
                const components = Geocoder.getLocationComponents(item);
                // console.log('geocodePosition: ' + JSON.stringify(components));
                return {
                  value: item.formatted_address,
                  route: components['route'],
                  street_number: components['street_number'],
                  postal_code: components['postal_code'],
                  locality: components['locality'],
                  province: components['province'],
                  region: components['region'],
                  country: components['country'],
                  country_code: components['country_code'],
                  lat: item.geometry.location.lat(),
                  lng: item.geometry.location.lng()
                };
              });
              observer.next(data[0]);
              observer.complete();
            } else {
              observer.next(null);
              observer.complete();
            }
          } else {
            observer.next(null);
            observer.complete();
          }
        });
      } else {
        observer.next(null);
        observer.complete();
      }
    });
  }
}
