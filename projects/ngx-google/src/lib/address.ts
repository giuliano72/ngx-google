export class Address {
  value: string;
  route: string;
  street_number: number;
  postal_code: number;
  locality: string;
  province: string;
  region: string;
  country: string;
  country_code: string;
  lat: number;
  lng: number;

  constructor(data?: { [key: string]: any }) {
    if (data) {
      this.value = data.value;
      this.route = data.route;
      this.street_number = data.street_number;
      this.postal_code = data.postal_code;
      this.locality = data.locality;
      this.province = data.province;
      this.region = data.region;
      this.country = data.country;
      this.country_code = data.country_code;
      this.lat = data.lat;
      this.lng = data.lng;
    }
  }

  clone() {
    const address = new Address();
    this.value = this.value;
    address.route = this.route;
    address.street_number = this.street_number;
    address.postal_code = this.postal_code;
    address.locality = this.locality;
    address.province = this.province;
    address.region = this.region;
    address.country = this.country;
    address.country_code = this.country_code;
    address.lat = this.lat;
    address.lng = this.lng;
  }
}
