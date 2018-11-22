import {
  AfterContentChecked, AfterContentInit,
  AfterViewChecked, AfterViewInit,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnInit, Output,
} from '@angular/core';

import {Observable, of, Subject} from 'rxjs';
import {MapCircleComponent} from './map.circle.component';
import {MapMarkerComponent} from './map.marker.component';
import {Gmap} from '../gmap';
import {NgxGoogleService} from '../ngx-google.service';
import {Gcircle} from '../gcircle';
import {Gmarker} from '../gmarker';
import {Position} from '../position';
import {MapInnerComponent} from './map.inner.component';

declare const google;

@Component({
  selector: 'glg-map',
  template: `<div>
                <div id="gMap" [ngStyle]="{'width': width, 'height': height}"></div>
                <ng-content></ng-content>
             </div>`,
})
export class MapComponent implements OnInit, AfterViewInit,  AfterViewChecked, AfterContentInit, AfterContentChecked {
  @Input() mapId = 'gMap';
  @Input('zoom') _zoom = 10;
  @Input() width = '50%';
  @Input() height = '400px';
  @Output() update = new EventEmitter();

  private _center: Position;
  private mapConfig: any;

  private innerComponents: MapInnerComponent[] = [];

  private gmap: Gmap;

  constructor(
    private googleService: NgxGoogleService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // console.log('MapComponent ngOnInit ...');

    this.mapConfig = {
      zoom: this._zoom,
      center: this.center
    };
  }

  ngAfterViewInit(): void {
    // console.log('MapComponent ngAfterViewInit ...');

  }

  ngAfterContentInit(): void {
    // console.log('MapComponent ngAfterContentInit ...');
    this.gmap = this.googleService.createMap(this.mapId, this.mapConfig);
  }


  get zoom() {
    return this._zoom;
  }

  set zoom(zoom: number) {
    // console.log('MapComponent set zoom: ' + zoom);
    this._zoom = zoom;
    this.gmap.zoom = zoom;
  }

  clearMarkers() {
    this.gmap.clearMarkers();
  }

  get center(): Position {
    return this._center;
  }

  @Input() set center(center: Position) {
    // console.log('MapComponent set center');
    this._center = center;
    if (this.gmap) {
      this.gmap.center = center;
    }
  }


  registerComponent(mapInnerComponent: MapInnerComponent) {
    // console.log('MapComponent registerComponent ...');


    this.innerComponents.push(mapInnerComponent);
  }

  unregisterComponent(mapInnerComponent: MapInnerComponent) {
    // console.log('MapComponent unregisterComponent ...');

    const index = this.innerComponents.indexOf(mapInnerComponent);
    if (index > -1){
      this.innerComponents.splice(index, 1);
    }
  }

  updateView() {
    // console.log('MapComponent updateView ...');
    this.innerComponents.forEach( (innerComponent) => {
      innerComponent.updateView();
    });
    this.update.emit();
  }

  ngAfterViewChecked(): void {
    //console.log('MapComponent ngAfterViewChecked');
    //console.log('MapComponent innerComponents: ' + this.innerComponents.length);
  }

  ngAfterContentChecked(): void {
    //console.log('MapComponent ngAfterContentChecked');

    this.innerComponents.forEach( (innerComponent) => {
      innerComponent.setGmap(this.gmap);
    });
  }

}
