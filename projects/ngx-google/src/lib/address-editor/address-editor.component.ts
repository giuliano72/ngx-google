import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {Address} from '../address';
import {NgxGoogleService} from '../ngx-google.service';

@Component({
  selector: 'glg-address-editor',
  templateUrl: 'address-editor.component.html',
  styleUrls: ['address-editor.component.css']
})
export class AddressEditorComponent implements OnInit {

  @Input() labels: any;
  @Input() parentForm: FormGroup;
  @Input() address: Address;
  addressForm: FormGroup;
  addresses: Address[];
  addressLoading = false;

  private currentAddressValue: string;
  private searchAddressTerms = new Subject<string>();

  constructor(
    private googleService: NgxGoogleService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.currentAddressValue = (this.address  && this.address.value) ? this.address.value : null;

    this.addressForm = this.formBuilder.group({
      value: [(this.address && this.address.value) ? this.address.value : null],
      route: [(this.address && this.address.route) ? this.address.route : null, [Validators.required]],
      street_number: [(this.address && this.address.street_number) ? this.address.street_number : null, [Validators.required]],
      postal_code: [(this.address && this.address.postal_code) ? this.address.postal_code : null],
      locality: [(this.address && this.address.locality) ? this.address.locality : null],
      province: [(this.address && this.address.province) ? this.address.province : null],
      region: [(this.address && this.address.region) ? this.address.region : null],
      country: [(this.address && this.address.country) ? this.address.country : null],
      country_code: [(this.address && this.address.country_code) ? this.address.country_code : null],
      lat: [(this.address && this.address.lat) ? this.address.lat : null],
      lng: [(this.address && this.address.lng) ? this.address.lng : null]
    });

    this.parentForm.addControl('address', this.addressForm);


    // INITIALIZE SEARCH ADDRESS SUBJECT
    this.searchAddressTerms.pipe(
      // wait 200ms after each keystroke before considering the term
      debounceTime(200),

      // ignore new term if same as previous term
       distinctUntilChanged(),

      tap(() => {this.addressLoading = true; }),

      // switch to new search observable each time the term changes
      switchMap(term => this.googleService.geocodeAddress(term)),

      tap(() => {this.addressLoading = false; })

    ).subscribe((addresses) => {
      this.addresses = addresses;
      this.cdr.detectChanges();
    });

  }

  get value() { return this.addressForm.get('value') as FormControl; }
  get route() { return this.addressForm.get('route') as FormControl; }
  get street_number() { return this.addressForm.get('street_number') as FormControl; }

  get invalid() { return this.route.invalid || this.street_number.invalid ; }

  selectAddress(address: Address) {
    this.addressForm.setValue({
      value: (address.value) ? address.value : null,
      route: (address.route) ? address.route : null,
      street_number: (address.street_number) ? address.street_number : null,
      postal_code: (address.postal_code) ? address.postal_code : null,
      locality: (address.locality) ? address.locality : null,
      province: (address.province) ? address.province : null,
      region: (address.region) ? address.region : null,
      country: (address.country) ? address.country : null,
      country_code: (address.country_code) ? address.country_code : null,
      lat: (address.lat) ? address.lat : null,
      lng: (address.lng) ? address.lng : null
    });

    this.currentAddressValue = (address.value) ? address.value : null;
  }


  addressOnBlur(): void {
    this.value.setValue(this.currentAddressValue);
    this.searchAddressTerms.next(null);
    this.cdr.detectChanges();
  }

  searchAddress(term: string): void {
    this.searchAddressTerms.next(term);
  }

}
