import {AfterViewChecked, AfterViewInit, Component, EventEmitter, Host, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MapComponent} from './map.component';
import {Subject} from 'rxjs';
import {debounceTime, tap} from 'rxjs/operators';
import {Gcircle} from '../gcircle';
import {Position} from '../position';
import {MapInnerComponent} from './map.inner.component';
import {Gmap} from '../gmap';

@Component({
  selector: 'glg-map-circle',
  template: ``
})
export class MapCircleComponent implements OnInit, OnDestroy, AfterViewInit, MapInnerComponent {
  @Input() draggable = false;
  @Input() options: any;

  private _center: Position;
  @Output() centerChange = new EventEmitter<Position>();

  private _radius: number;
  private _circle: Gcircle;

  private centerChanges = new Subject<Position>();

  constructor(@Host() private mapComponent: MapComponent) { }


  ngOnInit(): void {
    // console.log('MapCircleComponent ngOnInit ...');

    this.centerChanges.pipe(
      debounceTime(100),
      tap( (position: Position) => {console.log(position);})
    ).subscribe((position: Position) => {
      // console.log('MapCircleComponent: center_changed!');
      this._center = position;
      this.centerChange.emit(this._center);
      this.mapComponent.updateView();
    });

    this.mapComponent.registerComponent(this);

  }

  ngAfterViewInit(): void {
    // console.log('MapCircleComponent ngAfterViewInit ...');
  }

  updateView() {
  }

  ngOnDestroy(): void {
    // console.log('MapCircleComponent ngOnDestroy: ' + this._circle );
    this._circle.delete();
  }

  setGmap(gmap: Gmap) {

    if (!this._circle) {
      // console.log('MapCircleComponent setGmap ...');

      this._circle = gmap.addCircle(
        this._center,
        this._radius,
        this.draggable,
        this.options
      );

      if (this._circle) {
        this._circle.addListener('center_changed', () => {
          // console.log('MapCircleComponent handle center_changed ... ');

          this.centerChanges.next(new Position(this._circle.center.latitude, this._circle.center.longitude));
        });
      }
    }
  }

  get radius() {
    if (this._circle) {
      return this._circle.radius;
    } else {
      return this._radius;
    }
  }

  @Input() set radius(radius: number) {
      // console.log('MapCircleComponent set radius: ' + radius);
      this._radius = radius;
      if (this._circle) {
        this._circle.radius = radius;
      }
  }

  get center(): Position {
    return this._center;
  }

  @Input() set center(center: Position) {

      // console.log('MapCircleComponent set center');
      this._center = center;

      if (this._circle) {
        this._circle.center = center;
      }
  }
}
