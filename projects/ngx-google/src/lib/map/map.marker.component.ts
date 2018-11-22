import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {MapComponent} from './map.component';
import {Subject, timer} from 'rxjs';
import {debounceTime, skipUntil, tap} from 'rxjs/operators';
import {Gmarker} from '../gmarker';
import {Position} from '../position';
import {MapInnerComponent} from './map.inner.component';
import {Gmap} from '../gmap';

@Component({
  selector: 'glg-map-marker',
  template: ``
})
export class MapMarkerComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, MapInnerComponent {
  @Input() image;
  @Input() draggable = false;
  @Input() info;
  @Input() centerMarker = false;

  private _position: Position;
  @Output() positionChange = new EventEmitter<Position>();

  public _marker: Gmarker;

  private positionChanges = new Subject<Position>();

  constructor(@Host() private mapComponent: MapComponent) {
  }

  ngOnInit(): void {
    // console.log('MapMarkerComponent ngOnInit ...');

    this.positionChanges.pipe(
      debounceTime(100),
      skipUntil(timer(100)),
      tap( (position: Position) => {console.log(position);})
    ).subscribe((position: Position) => {
      // console.log('MapMarkerComponent: position_changed!');
      this._position = position;
      this.positionChange.emit(this._position);
      this.mapComponent.updateView();
    });

    this.mapComponent.registerComponent(this);
  }

  ngAfterViewInit(): void {
    // console.log('MapMarkerComponent ngAfterViewInit ...');

  }

  ngAfterContentInit(): void {
    // console.log('MapMarkerComponent ngAfterContentInit ...');
  }

  updateView() {
    // console.log('MapMarkerComponent updateView ...');
    if (this._marker){
      this._marker.hideInfo();
    }
  }

  ngOnDestroy(): void {
    // console.log('MapMarkerComponent ngOnDestroy: ' + this._marker);
    this._marker.delete();
    this._marker = null;
    this.mapComponent.unregisterComponent(this);
  }

  setGmap(gmap: Gmap) {

    if (!this._marker) {
      // console.log('MapMarkerComponent setGmap ...');

      this._marker = gmap.addMarker(
        this._position,
        this.image,
        this.draggable,
        this.centerMarker
      );

      if (this._marker) {
        this._marker.addListener('position_changed', () => {
          // console.log('MapMarkerComponent handle position_changed ... ');

          this.positionChanges.next(new Position(this._marker.position.latitude, this._marker.position.longitude));
        });

        if (this.info && this.info.template) {
          this._marker.addListener('click', () => {

            console.log('MapMarkerComponent handle click ... ');
            console.log('MapMarkerComponent info.template(' + this.info.template + ')');

            const distance = (gmap.computeDistanceFromCenter(this._marker.position)/1000).toFixed(2);
            const context = this.info;
            const content = `${eval(this.info.template)}`;
            this._marker.showInfo(content);
          });
        }

      }
    }
  }

  get position(): Position {
    // console.log('MapMarkerComponent get position');
    return this._position;
  }

  @Input() set position(position: Position) {
     console.log('MapMarkerComponent set position');
    this._position = position;

    if (this._marker) {
      this._marker.hideInfo();
      this._marker.position = position;
    }
  }
}
