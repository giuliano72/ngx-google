import {AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Position} from './position';
import {forkJoin, merge, observable, Observable, of} from 'rxjs';
import {NgxGoogleService} from './ngx-google.service';
import {Address} from './address';
import {PositionInfo} from './position.info';
import {map} from 'rxjs/operators';
import {AddressInfo} from './address.info';

@Component({
  selector: 'glg-ngx-google',
  template: `
    <p>
      ngx-google works! ...
    </p>
    <div *ngIf="initCompleted">
      Label: <!--label *ngIf="address_position.addressLoading" >Loading data please wait ...</label-->
      <glg-address #address_position [position]="center" (addressChange)="setAddress($event)">
      </glg-address>
      <br/>
      <glg-map-circle-radius-control [(radius)]="radius" [values]="radiusValues"></glg-map-circle-radius-control>
      <br/>
      <glg-map #map [center]="mapCenter" width="100%" (update)="updateView()">
        <glg-map-marker [position]="salon" [info]="salon.info" *ngFor="let salon of salons | distance:center:radius">
        </glg-map-marker>
        <glg-map-circle #circle [(center)]="center" [radius]="radius" [draggable]="true" [options]="areaOptions"></glg-map-circle>
        <glg-map-marker #centerMarker [(position)]="center" [image]="centerImage" [draggable]="true" [info]="centerInfo" [centerMarker]="true"></glg-map-marker>
      </glg-map>
      <br/>
      <!--div *ngFor="let salon of salons | distance:center:radius">
        <div [innerHtml]="salon.info.content"></div>
      </div-->
      <br/>
      <glg-group-by-region [items]="itemsAddress"></glg-group-by-region>
    </div>
  `,
  styles: []
})
export class NgxGoogleComponent implements OnInit, OnChanges, AfterViewChecked, AfterContentChecked {

  mapCenter: Position;
  center: Position;

  centerImage = {
    url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  };

  areaOptions = {
    strokeColor: '#999999',
    strokeOpacity: 1,
    strokeWeight: 1,
    fillColor: '#999999',
    fillOpacity: 0.2
  };
  centerInfo = { content: 'The Center Marker'};

  radius = 10000;
  radiusValues = [
    {label: '10 Km', radius: 10000},
    {label: '50 Km', radius: 50000},
    {label: '100 Km', radius: 100000},
    {label: 'Oltre 100 Km', radius: -1}
  ];


  salons: PositionInfo[];
  itemsAddress: AddressInfo[];

  private labelsLoaded = false;

  constructor(
    private googleService: NgxGoogleService,
    private cdr: ChangeDetectorRef) {

    this.salons = [];
  }

  ngOnInit(): void {
    this.salons.push(new PositionInfo(41.91067624268916, 12.476356596622168, {template: '\`<div><h2>INFO 1 ${context.salon.name} </h2><p>a simple INFO Point distant ${distance} Km</p></div>\`', salon: {name: 'SALON 1'}}));
    this.salons.push(new PositionInfo(42.91067624268916, 13.476356596622168, {template: '\`<div><h2>INFO 2</h2><p>a simple INFO Point</p></div>\`'}));
    this.salons.push(new PositionInfo(42.91067624268916, 12.476356596622168, {template: '\`<div><h2>INFO 3</h2><p>a simple INFO Point</p></div>\`'}));
    this.salons.push(new PositionInfo(41.91067624268916, 13.476356596622168, {template: '\`<div><h2>INFO 4</h2><p>a simple INFO Point</p></div>\`'}));
    this.salons.push(new PositionInfo(42.91067624268916, 13.476356596622168, {template: '\`<div><h2>INFO 5</h2><p>a simple INFO Point</p></div>\`'}));


    const observables = this.salons.map((position) => this.googleService.geocodePosition(position).pipe(
      map( (address) => { return new AddressInfo(address, {content: address.value }); })
    ));
    forkJoin(observables).subscribe((items: AddressInfo[]) => {
      this.itemsAddress = items;
    });


    //this.salons = of(this._salons);

    setTimeout(() => {
        this.labelsLoaded = true;
      },
      2000
    );

    // ROME
    const defaultPosition = new Position(41.91067624268916, 12.476356596622168);
    this.googleService.geocodeClient(defaultPosition).subscribe((position) => {
        this.center = position.clone();
        this.mapCenter = position.clone();
    });

  }

  get initCompleted() {
    return (this.labelsLoaded && this.center && this.mapCenter);
  }

  setAddress(address: Address){
    console.log('NgxGoogleComponent.setAddress: ' + JSON.stringify(address));
    // this.address = address;

    this.mapCenter = new Position( address.lat,  address.lng);
    this.center = new Position( address.lat,  address.lng);
  }

  updateView() {
    console.log('NgxGoogleComponent updateView ...');
    this.cdr.detectChanges();
  }

  ngAfterViewChecked(): void {
    //console.log('NgxGoogleComponent ngAfterViewChecked');
  }

  ngAfterContentChecked(): void {
    //console.log('NgxGoogleComponent ngAfterContentChecked');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('NgxGoogleComponent ngOnChanges');
  }

}
