import {Address} from './address';

export class AddressInfo extends Address {
  info: any;

  constructor(data?: { [key: string]: any }, info?: any) {
    super(data);
    this.info = info;
  }

  clone() {
    return new AddressInfo(this, this.info);
  }
}
