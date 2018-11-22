import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NgxGoogleService} from './ngx-google.service';
import {Address} from './address';
import {Position} from './position';


@Component({
  selector: 'glg-address',
  template: `<div class="my-1">
                <input [(ngModel)]="currentAddressValue"
                    [ngClass]="{'form-control my-1': true}"
                    (keyup)="searchAddress(currentAddressValue)"
                    (blur)="addressOnBlur()"
                    autocomplete="new-password"
                />
                <div class="list-group" *ngIf="addresses && addresses.length>0">
                  <a class="list-group-item" *ngFor="let address of addresses"  (click)="selectAddress(address)"
                   style="cursor: pointer;">
                  {{address.value}}
                  </a>
                </div>
            </div>`,
  styles: []
})
export class AddressComponent implements OnInit {
  @Input() address: Address;
  @Output() addressChange = new EventEmitter<Address>();

  addresses: Address[];
  public addressLoading = true;

  currentAddressValue: string;
  private searchPositionTerms = new Subject<Position>();
  private searchAddressTerms = new Subject<string>();

  constructor(
    private googleService: NgxGoogleService,
    private cdr: ChangeDetectorRef) {


    // INITIALIZE SEARCH ADDRESS SUBJECT
    this.searchAddressTerms.pipe(
      // wait 200ms after each keystroke before considering the term
      debounceTime(200),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      tap(() => {
        console.log('AddressComponent(searchAddress) switching addressLoading to true.');
        this.addressLoading = true;
        this.cdr.detectChanges();
      }),

      // switch to new search observable each time the term changes
      switchMap(term => this.googleService.geocodeAddress(term)),

      tap((addresses: Address[]) => {
        console.log('AddressComponent(searchAddress) switching addressLoading to false.');
        console.log('AddressComponent(searchAddress): addresses =  ' + JSON.stringify(addresses));
        this.addressLoading = false;
        this.cdr.detectChanges();
      }),

    ).subscribe((addresses: Address[]) => {
      this.addresses = addresses;
      this.cdr.detectChanges();
    });




    // INITIALIZE SEARCH POSITION SUBJECT
    this.searchPositionTerms.pipe(
      // wait 200ms after each search before considering the new one
      //debounceTime(1000),

      tap(() => {
        console.log('AddressComponent(searchPosition) switching addressLoading to true.');
        this.addressLoading = true;
        this.cdr.detectChanges();
      }),

      // switch to new search observable each time the position changes
      switchMap(position => this.googleService.geocodePosition(position)),


      tap(() => {
        console.log('AddressComponent(searchPosition) switching addressLoading to false.');
        this.addressLoading = false;
        this.cdr.detectChanges();
      })


    ).subscribe((address: Address) => {

      this.address = address;
      console.log('address: ' + JSON.stringify(address));
      this.currentAddressValue = (address && address.value) ? address.value : null;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('AddressComponent onInit');

    if (this.address == null) {
      this.address = new Address();
    }

    this.currentAddressValue = this.address.value;
  }


  @Input() set position(position: Position) {
    console.log('AddressComponent set position');
    this.searchPositionTerms.next(position);
  }

  selectAddress(address: Address) {
    console.log('AddressComponent.selectAddress ...');
    this.address = address;
    this.currentAddressValue = (address && address.value) ? address.value : null;
    this.addresses = [];
    this.addressChange.emit(address);
    this.cdr.detectChanges();
    //this.searchAddressTerms.next(null);
  }


  addressOnBlur(): void {
    console.log('AddressComponent.addressOnBlur ...');
    this.currentAddressValue = (this.address.value) ? this.address.value : null;
    //this.searchAddressTerms.next(null);
    //this.addresses = [];
    this.cdr.detectChanges();
  }

  searchAddress(term: string): void {
    console.log('AddressComponent.searchAddress ...');
    this.searchAddressTerms.next(term);
  }

}
