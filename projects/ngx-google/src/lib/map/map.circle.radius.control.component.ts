import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'glg-map-circle-radius-control',
  template: `<div class="d-flex justify-content-center">
                <div class="m-3" *ngFor="let value of values">
                  <input type="radio" [(ngModel)]="radius" [value]="value.radius"/>
                  <label>{{value.label}}</label>
                </div>
            </div>`,
})

export class MapCircleRadiusControlComponent {
  @Input() values;
  @Input('radius') _radius: number;
  @Output() radiusChange = new EventEmitter<number>();


  get radius() {
    return this._radius;
  }

  set radius(radius){
    this._radius = radius;
    this.radiusChange.emit(radius);
  }
}
